"use client";

import { useState } from "react";
import type { BadgeType, ProfileWithBadgesType } from "@/types/types";
import { Board } from "./board";
import { SlidingTabs } from "./sliding-tabs";

const TABS = ["Wszyscy", "Management", "Development", "Marketing"];
const SECTION_BY_TAB = [
  null,
  "management",
  "development",
  "marketing",
] as const;

export function List({
  profiles,
  badges,
}: {
  profiles: ProfileWithBadgesType[];
  badges: BadgeType[];
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const section = SECTION_BY_TAB[activeTabIndex];
  const visibleProfiles = section
    ? profiles.filter((p) => p.section === section)
    : profiles;

  return (
    <div className="flex flex-col items-center">
      <SlidingTabs
        tabs={TABS}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />
      <Board profiles={visibleProfiles} badges={badges} />
    </div>
  );
}
