/*
  # Add completion tracking for cards and tasks

  1. Schema Changes
    - Add `completed` boolean column to `cards` table with default false
    - Add `completed` boolean column to `project_tasks` table with default false
    - Add `cover_image` text column to `projects` table for storing cover image URLs
    - Add `completed_at` timestamp columns for tracking when items were completed

  2. Security
    - No RLS changes needed as existing policies cover these columns

  3. Storage
    - Create project-covers storage bucket for cover images
*/

-- Add completion tracking to cards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'completed'
  ) THEN
    ALTER TABLE cards ADD COLUMN completed boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE cards ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Add completion tracking to project_tasks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_tasks' AND column_name = 'completed'
  ) THEN
    ALTER TABLE project_tasks ADD COLUMN completed boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_tasks' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE project_tasks ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Add cover_image to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'cover_image'
  ) THEN
    ALTER TABLE projects ADD COLUMN cover_image text;
  END IF;
END $$;

-- Create storage bucket for project covers if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-covers', 'project-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for project covers
DO $$
BEGIN
  -- Policy for authenticated users to upload their own project covers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload project covers'
  ) THEN
    CREATE POLICY "Users can upload project covers"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-covers');
  END IF;

  -- Policy for public read access to project covers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access to project covers'
  ) THEN
    CREATE POLICY "Public read access to project covers"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'project-covers');
  END IF;

  -- Policy for users to update their own project covers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update project covers'
  ) THEN
    CREATE POLICY "Users can update project covers"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'project-covers');
  END IF;

  -- Policy for users to delete their own project covers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete project covers'
  ) THEN
    CREATE POLICY "Users can delete project covers"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-covers');
  END IF;
END $$;