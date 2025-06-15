
-- 1. Recreate project_contributors table
CREATE TABLE public.project_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'contributor',
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);

-- 2. Enable RLS
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;

-- 3. Add policy: contributor and project owner can view
CREATE POLICY "Contributors and owner can view" ON public.project_contributors
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_contributors.project_id AND projects.user_id = auth.uid()
    )
  );

-- 4. Allow inserting by self (invite acceptance)
CREATE POLICY "Invited user can self-add as contributor" ON public.project_contributors
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

-- 5. Allow contributors to remove themselves
CREATE POLICY "Contributor can remove themselves" ON public.project_contributors
  FOR DELETE USING (
    user_id = auth.uid()
  );
