import { createClient } from "@/lib/supabase/server";
import type { Badge, ProfileWithBadges } from "@/types/types";

// Surowy kształt tego, co zwraca zapytanie (snake_case, jak w bazie)
type BadgeRow = {
  id: string;
  name: string;
  description: string;
  max_steps: number;
  color: string | null;
  svg_path: string | null;
};

type ProfileRow = {
  id: string;
  name: string;
  surname: string;
  biogram: string;
  section: ProfileWithBadges["section"];
  status: ProfileWithBadges["status"];
  created_at: string;
  user_badges: {
    cur_steps: number;
    created_at: string;
    updated_at: string;
    // zależnie od typów Supabase może przyjść obiekt albo tablica
    badges: BadgeRow | BadgeRow[] | null;
  }[];
};

function mapBadge(row: BadgeRow): Badge {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    maxSteps: row.max_steps,
    color: row.color,
    svgPath: row.svg_path || null, // pusty string traktujemy jak brak pliku
  };
}

export async function getProfilesWithBadges(): Promise<ProfileWithBadges[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id, name, surname, biogram, section, status, created_at,
      user_badges (
        cur_steps, created_at, updated_at,
        badges ( id, name, description, max_steps, color, svg_path )
      )
    `,
    )
    .order("surname");

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as ProfileRow[];

  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    surname: p.surname,
    biogram: p.biogram,
    section: p.section,
    status: p.status,
    createdAt: p.created_at,
    badges: p.user_badges.flatMap((ub) => {
      const badge = Array.isArray(ub.badges) ? ub.badges[0] : ub.badges;
      if (!badge) return []; // pomijamy rekordy bez odznaki
      return [
        {
          badge: mapBadge(badge),
          curSteps: ub.cur_steps,
          createdAt: ub.created_at,
          updatedAt: ub.updated_at,
        },
      ];
    }),
  }));
}
