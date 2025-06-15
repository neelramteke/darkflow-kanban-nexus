
-- 1. Create the project_invites table
CREATE TABLE public.project_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, email)
);

-- 2. Enable Row Level Security
ALTER TABLE public.project_invites ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Project owner can insert invites
CREATE POLICY "Project owner can invite by email"
  ON public.project_invites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_invites.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- 4. Policy: Inviter and invitee can view invites
CREATE POLICY "Owner and invitee can view invites"
  ON public.project_invites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_invites.project_id
        AND projects.user_id = auth.uid()
    )
    OR email = auth.jwt() ->> 'email'
  );

-- 5. Policy: Only invitee can update invite (accept/reject)
CREATE POLICY "Only invitee can update accepted state"
  ON public.project_invites
  FOR UPDATE
  USING (
    email = auth.jwt() ->> 'email'
  );
