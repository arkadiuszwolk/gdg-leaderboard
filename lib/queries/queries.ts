import { createClient } from "@/lib/supabase/server";
import type { BadgeType } from "@/types/types";

export async function getBadges(): Promise<BadgeType[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("badges")
    .select("id, name, description, max_steps, color, svg_path")
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    maxSteps: b.max_steps,
    color: b.color,
    svgPath: b.svg_path
      ? supabase.storage.from("badges").getPublicUrl(b.svg_path).data.publicUrl
      : null,
  }));
}
