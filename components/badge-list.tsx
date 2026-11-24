import { getBadges } from "@/lib/queries/queries";
import { Badge } from "./badge";

export async function BadgeList() {
  const badges = await getBadges();

  return (
    <ul className="w-80 space-y-2">
      {badges.map((badge) => (
        <Badge
          badge={badge}
          configure={{ type: "list-badge", color: badge.color, size: 3 }}
        />
      ))}
    </ul>
  );
}
