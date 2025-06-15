
-- Add 'completed' column to cards if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'completed'
  ) THEN
    ALTER TABLE cards ADD COLUMN completed boolean DEFAULT false;
  END IF;
END $$;

-- Add 'completed_at' column to cards if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE cards ADD COLUMN completed_at timestamptz;
  END IF;
END $$;
