import { createClient } from "@/lib/supabase/server";
import type { ProfileWithBadgesType } from "@/types/types";

export async function getProfilesWithBadges(): Promise<
  ProfileWithBadgesType[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id, name, surname, biogram, section, status, created_at,
      user_badges ( badge_id, cur_steps, created_at, updated_at )
    `,
    )
    .order("surname");

  if (error) throw new Error(error.message);

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    surname: p.surname,
    biogram: p.biogram,
    section: p.section,
    status: p.status,
    createdAt: p.created_at,
    userBadges: p.user_badges.map((ub) => ({
      badgeId: ub.badge_id,
      curSteps: ub.cur_steps,
      createdAt: ub.created_at,
      updatedAt: ub.updated_at,
    })),
  }));
}
