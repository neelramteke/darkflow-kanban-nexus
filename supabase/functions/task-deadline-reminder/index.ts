
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayString = `${yyyy}-${mm}-${dd}`;

  // 1. Find all tasks with deadline today
  const { data: tasks, error: taskError } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("task_date", todayString);

  if (taskError || !tasks || tasks.length === 0) {
    console.log("No tasks due today or error:", taskError);
    return new Response(
      JSON.stringify({ ok: true, message: "No reminders to send." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }}
    );
  }

  const reminders: any[] = [];

  for (const task of tasks) {
    // Get the project + user
    const { data: project, error: projErr } = await supabase
      .from("projects")
      .select("id, name, user_id")
      .eq("id", task.project_id)
      .single();

    if (projErr || !project) {
      console.log("Project not found for task", task.id, projErr);
      continue;
    }

    // Get the user's email from the auth.users table
    // Can't join directly, so use the admin API
    let userEmail: string | null = null;
    try {
      // @ts-ignore: Supabase admin API, works on Deno Edge
      const { data: userinfo, error: userErr } = await supabase.auth.admin.getUserById(project.user_id);
      if (userinfo && userinfo.user) {
        userEmail = userinfo.user.email;
      }
    } catch (e) {
      console.log("Error getting user email", e);
      continue;
    }

    if (!userEmail) {
      console.log("No user email for project", project.id);
      continue;
    }

    // Send reminder email via Resend
    const subject = `Task Deadline Reminder: ${task.title}`;
    const html = `
      <h2>Task deadline today: ${task.title}</h2>
      <p><b>Project:</b> ${project.name}</p>
      <p><b>Description:</b> ${task.description || "No description"}</p>
      <p><b>Due Date:</b> ${todayString}</p>
      <p>Please check your project calendar for details.</p>
    `;
    try {
      const mailRes = await resend.emails.send({
        from: "Deadline Reminder <onboarding@resend.dev>",
        to: [userEmail],
        subject,
        html,
      });
      reminders.push({ to: userEmail, status: "sent", id: task.id });
      console.log("Sent reminder to", userEmail, "for task", task.id);
    } catch (e) {
      console.log("Failed to send to", userEmail, e);
      reminders.push({ to: userEmail, status: "failed", id: task.id });
    }
  }

  return new Response(JSON.stringify({ ok: true, reminders }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
