import Image from "next/image";
import { Badge } from "./badge";
import type {
  BadgeType,
  ProfileWithBadgesType,
  UserBadgeType,
} from "@/types/types";
import Link from "next/link";

export function Board({
  profiles,
  badges,
}: {
  profiles: ProfileWithBadgesType[];
  badges: BadgeType[];
}) {
  const badgesById = new Map(badges.map((b) => [b.id, b]));

  return (
    <ul className="w-full md:w-200 py-8 space-y-2">
      {profiles.map((p) => (
        <BoardItem key={p.id} profile={p} badgesById={badgesById} />
      ))}
    </ul>
  );
}

function BoardItem({
  profile: p,
  badgesById,
}: {
  profile: ProfileWithBadgesType;
  badgesById: Map<string, BadgeType>;
}) {
  return (
    <Link href={`/profiles/${p.id}`} className="block">
      <li className="px-4 py-2 rounded-xl bg-neutral-100 flex items-center justify-between">
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
          <ItemBadges userBadges={p.userBadges} badgesById={badgesById} />
        </div>
      </li>
    </Link>
  );
}

function ItemBadges({
  userBadges,
  badgesById,
}: {
  userBadges: UserBadgeType[];
  badgesById: Map<string, BadgeType>;
}) {
  const MAX_VISIBLE_BADGES = 4;
  const hidden = userBadges.length - MAX_VISIBLE_BADGES;

  return (
    <div className="flex items-center gap-1">
      {userBadges
        .filter((b) => b.curSteps !== 0)
        .slice(0, MAX_VISIBLE_BADGES)
        .map((userBadge) => {
          const badge = badgesById.get(userBadge.badgeId);
          if (!badge) return null;

          return (
            <Badge
              key={userBadge.badgeId}
              badge={badge}
              configure={{ type: "only-badge", color: badge.color, size: 4 }}
              userBadge={userBadge}
            />
          );
        })}
      {hidden > 0 && (
        <div className="w-16 h-16 text-sm rounded-full flex justify-center items-center bg-neutral-300 shrink-0">
          +{hidden}
        </div>
      )}
    </div>
  );
}
