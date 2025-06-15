
/**
 * Local extensions for Supabase types to support new columns until the types are regenerated from Supabase.
 */

// Extends cards with completion fields
export type CardWithCompletion = import("@/integrations/supabase/types").Tables<"cards"> & {
  completed?: boolean;
  completed_at?: string | null;
};

// Extends project_tasks with completion fields
export type TaskWithCompletion = import("@/integrations/supabase/types").Tables<"project_tasks"> & {
  completed?: boolean;
  completed_at?: string | null;
};

// Extends projects with cover image field
export type ProjectWithCover = import("@/integrations/supabase/types").Tables<"projects"> & {
  cover_image?: string | null;
};
