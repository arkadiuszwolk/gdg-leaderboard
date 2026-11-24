import { BadgeList } from "@/components/badge-list";
import { Board } from "@/components/board";
import { List } from "@/components/list";
import { SlidingTabs } from "@/components/sliding-tabs";
import { getProfilesWithBadges } from "@/lib/queries/members";
import { getBadges } from "@/lib/queries/queries";
import { Suspense } from "react";

const MAX_VISIBLE_BADGES = 4;

export async function Members() {
  const profiles = await getProfilesWithBadges();
  const badges = await getBadges();

  return <List profiles={profiles} badges={badges} />;
}

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center px-4 py-12">
      <div className="fixed top-32 left-12">
        <BadgeList />
      </div>
      <Suspense fallback={<p>Ładowanie członków...</p>}>
        <Members />
      </Suspense>
    </div>
  );
}
