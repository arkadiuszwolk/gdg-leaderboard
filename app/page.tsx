import { Badge } from "@/components/badge";
import { getProfilesWithBadges } from "@/lib/queries/members";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Suspense } from "react";

const MAX_VISIBLE_BADGES = 4;

export async function Members() {
  const profiles = await getProfilesWithBadges();

  return (
    <ul className="w-200 py-8 space-y-2">
      {profiles.map((p) => {
        const hidden = p.badges.length - MAX_VISIBLE_BADGES;

        return (
          <li
            key={p.id}
            className="px-4 py-2 rounded-xl bg-neutral-100 flex items-center justify-between"
          >
            <div className="flex gap-2 items-center">
              <Image
                src="/człowiek.jpg"
                width={50}
                height={50}
                alt={`${p.name} ${p.surname}`}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {p.name} {p.surname}
                </span>
                <span className="text-xs">
                  {p.section ?? "-"}・{p.status}
                </span>
              </div>
            </div>

            <div className="flex gap-1 items-center">
              {p.badges.slice(0, MAX_VISIBLE_BADGES).map((ub) => (
                <Badge
                  key={ub.badge.id}
                  badge={{
                    id: ub.badge.id,
                    name: ub.badge.name,
                    description: ub.badge.description,
                    max_steps: ub.badge.maxSteps,
                    svg: ub.badge.svgPath,
                  }}
                  configure={{
                    type: "only-badge",
                    color: ub.badge.color,
                    size: 3,
                  }}
                  userBadge={{
                    badgeId: ub.badge.id,
                    created_at: ub.createdAt,
                    updated_at: ub.updatedAt,
                    cur_steps: ub.curSteps,
                  }}
                />
              ))}

              {hidden > 0 && (
                <div className="w-12 h-12 text-sm rounded-full flex justify-center items-center bg-neutral-300 shrink-0">
                  +{hidden}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function Page() {
  // const supabase = await createClient();
  // const { data, error } = await supabase.from("badges").select("*");
  // let badges;
  // if (error || !data) return <h1>Wystąpił błąd.</h1>;
  // badges = data;
  // console.log(data);

  return (
    <div className="flex justify-center">
      {/* <ul className="fixed top-8 left-8 w-80 space-y-2">
        {badges.map((badge) => (
          <li key={badge.id}>
            <Badge
              badge={badge}
              configure={{ type: "list-badge", color: badge.color, size: 3 }}
            />
          </li>
        ))}
      </ul> */}
      <Suspense fallback={<p>Ładowanie członków...</p>}>
        <Members />
      </Suspense>
    </div>
  );
}
