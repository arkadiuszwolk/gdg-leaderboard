"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function SlidingTabs({
  tabs,
  activeTabIndex,
  setActiveTabIndex,
}: {
  tabs: string[];
  activeTabIndex: number;
  setActiveTabIndex: (activeTabIndex: number) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const update = () => {
      const el = tabRefs.current[activeTabIndex];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };

    update();

    const observer = new ResizeObserver(update);
    tabRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeTabIndex, tabs]);

  return (
    <div className="relative rounded-full bg-gray-100 overflow-hidden h-12 border-3 border-neutral-100 w-fit">
      <div
        className="absolute left-0 top-0 h-full w-20 bg-white rounded-full z-10 transition-all duration-300"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {tabs.map((tab, i) => (
        <button
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          onClick={() => setActiveTabIndex(i)}
          key={tab}
          className="relative px-4 h-full z-20 text-sm"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
