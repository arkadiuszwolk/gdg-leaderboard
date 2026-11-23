"use client";

import { BadgeType, ProfileWithBadgesType } from "@/types/types";
import { Board } from "./board";
import { SlidingTabs } from "./sliding-tabs";
import { act, useState } from "react";

export function List({
  profiles,
  badges,
}: {
  profiles: ProfileWithBadgesType[];
  badges: BadgeType[];
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  console.log(activeTabIndex);
  return (
    <div className="flex flex-col items-center">
      <SlidingTabs
        tabs={["Wszyscy", "Management", "Development", "Marketing"]}
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={(activeTabIndex) =>
          setActiveTabIndex(activeTabIndex)
        }
      />
      <Board profiles={profiles} badges={badges} />
    </div>
  );
}
