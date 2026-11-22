"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type BadgeData = {
  id: string;
  name: string;
  description: string;
  max_steps: number;
  svg: ReactNode;
};

export type UserBadge = {
  badgeId: string;
  created_at: string;
  updated_at: string;
  cur_steps: number;
};

export type BadgeConfigure = {
  color: string;
  type: "only-badge" | "list-badge" | "full-badge" | "manage-badge";
  /** Badge artwork diameter in rem; the ring, gap, and image scale proportionally. */
  size?: number;
};

export type BadgeProps = {
  badge: BadgeData;
  userBadge?: UserBadge;
  isDeleted?: boolean;
  configure?: BadgeConfigure;
  onStepChange?: (curSteps: number) => void;
  onDelete?: () => void;
};

const DISPLAY_NAME_LIMIT = 24;
const DISPLAY_DESCRIPTION_LIMIT = 100;

function truncateText(value: string, limit: number) {
  const trimmed = value.trim();
  return trimmed.length > limit
    ? `${trimmed.slice(0, limit).trimEnd()}…`
    : trimmed;
}

function segmentDash(total: number) {
  const circumference = 2 * Math.PI * 47;
  const segmentLength = circumference / total;
  const visibleGap = 0.85;
  const dash = Math.max(0, segmentLength - 5 - visibleGap);
  return { circumference, dash };
}

export function Badge({
  badge,
  userBadge,
  isDeleted = false,
  configure,
  onStepChange,
  onDelete,
}: BadgeProps) {
  const type = configure?.type ?? "only-badge";
  const color = configure?.color ?? "#7867f5";
  const hasRing = badge.max_steps > 1;
  const steps = Math.max(1, Math.floor(badge.max_steps));
  const completed = userBadge
    ? Math.min(steps, Math.max(0, Math.floor(userBadge.cur_steps)))
    : 0;
  const isUnavailable = type === "manage-badge" && isDeleted;
  const defaultSize =
    type === "list-badge" ? 4.5 : type === "full-badge" ? 9 : 7;
  const size =
    typeof configure?.size === "number" &&
    Number.isFinite(configure.size) &&
    configure.size > 0
      ? configure.size
      : defaultSize;
  const ringPadding = hasRing ? `${size * 0.1}rem` : 0;
  const { circumference, dash } = segmentDash(steps);
  const displayName = truncateText(badge.name, DISPLAY_NAME_LIMIT);
  const displayDescription = truncateText(
    badge.description,
    DISPLAY_DESCRIPTION_LIMIT,
  );

  return (
    <div
      className={cn(
        "flex items-center text-[#25242b]",
        type === "only-badge" && "justify-center",
        type === "manage-badge" && "justify-center gap-4",
        type === "list-badge" && "w-[min(calc(100%-54px),290px)] gap-3.75",
        type === "full-badge" &&
          "max-w-75 flex-col gap-3.25 px-5 py-8 text-center",
      )}
      style={{ "--badge-color": color } as CSSProperties}
    >
      {type === "manage-badge" && (
        <div
          className="flex items-center justify-center"
          role="group"
          aria-label="Zarządzanie postępem odznaki"
        >
          <button
            type="button"
            className="grid size-8.5 flex-none cursor-pointer place-items-center rounded-full border border-[#e3e0ed] bg-white p-0 text-[20px] leading-none text-[#5142bf] shadow-[0_2px_7px_#25203310] transition-[transform,background,border-color,opacity] duration-180 hover:-translate-y-px hover:border-[#b6afff] hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-[#7867f5] focus-visible:outline-offset-[3px] disabled:cursor-not-allowed disabled:opacity-[.38] disabled:hover:translate-y-0 disabled:hover:border-[#e3e0ed] disabled:hover:bg-white"
            aria-label="Odejmij segment postępu"
            disabled={completed === 0}
            onClick={() => {
              if (completed === 1) {
                if (window.confirm("Czy na pewno chcesz usunąć tę odznakę?"))
                  onDelete?.();
                return;
              }
              onStepChange?.(completed - 1);
            }}
          >
            −
          </button>
        </div>
      )}
      <div
        className="group relative flex-none"
        tabIndex={type === "only-badge" ? 0 : undefined}
        aria-label={type === "only-badge" ? badge.name : undefined}
      >
        <div
          className={cn(
            "relative grid place-items-center rounded-full",
            isUnavailable && "grayscale opacity-55",
          )}
          style={{
            width: `${size}rem`,
            height: `${size}rem`,
            padding: ringPadding,
          }}
          role="img"
          aria-label={`${displayName}${hasRing ? `, ${completed} z ${steps} kroków` : ""}`}
        >
          {hasRing && (
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {Array.from({ length: steps }, (_, index) => (
                <motion.circle
                  key={`${steps}-${index}`}
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={(-index * circumference) / steps}
                  transform="rotate(-90 50 50)"
                  initial={false}
                  animate={{
                    stroke:
                      index < completed
                        ? color
                        : "color-mix(in srgb, var(--badge-color) 15%, #d9d9e3)",
                  }}
                  transition={{
                    duration: 0.42,
                    delay: index < completed ? index * 0.055 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </svg>
          )}
          <div
            className="relative h-full w-full overflow-hidden rounded-full transition-[filter] duration-240 [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:object-cover"
            style={{
              filter:
                !isUnavailable &&
                !hasRing &&
                userBadge !== undefined &&
                completed === 0
                  ? "grayscale(1) opacity(.45)"
                  : undefined,
            }}
          >
            {/* {badge.svg} */}
            <Image
              src="/globe.svg"
              alt="Ikona odznaki"
              fill
              className="object-contain"
            />
          </div>
        </div>
        {type === "only-badge" && (
          <div
            className="pointer-events-none absolute top-[calc(100%+7px)] left-1/2 z-10 max-w-[min(240px,80vw)] -translate-x-1/2 -translate-y-1.25 overflow-hidden rounded-[7px] border border-[#e8e6ee] bg-white px-2.75 py-1.75 text-center text-[11px] leading-[1.35] font-semibold whitespace-nowrap text-ellipsis text-[#36343e] opacity-0 shadow-[0_5px_16px_#25203312] transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            {displayName}
          </div>
        )}
      </div>
      {type === "manage-badge" && (
        <div
          className="flex items-center justify-center"
          role="group"
          aria-label="Zarządzanie postępem odznaki"
        >
          <button
            type="button"
            className="grid size-8.5 flex-none cursor-pointer place-items-center rounded-full border border-[#e3e0ed] bg-white p-0 text-[20px] leading-none text-[#5142bf] shadow-[0_2px_7px_#25203310] transition-[transform,background,border-color,opacity] duration-180 hover:-translate-y-px hover:border-[#b6afff] hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-[#7867f5] focus-visible:outline-offset-[3px] disabled:cursor-not-allowed disabled:opacity-[.38] disabled:hover:translate-y-0 disabled:hover:border-[#e3e0ed] disabled:hover:bg-white"
            aria-label="Dodaj segment postępu"
            disabled={completed === steps}
            onClick={() => onStepChange?.(completed + 1)}
          >
            +
          </button>
        </div>
      )}
      {(type === "list-badge" || type === "full-badge") && (
        <div
          className={cn(
            "min-w-0",
            type === "full-badge" && "w-[min(260px,calc(100vw-80px))]",
          )}
        >
          <h3
            className={cn(
              "m-0 overflow-hidden text-[14px] leading-[1.35] font-[650] text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1] font-medium",
              type === "full-badge" && "text-[16px]",
            )}
            title={badge.name}
          >
            {displayName}
          </h3>
          {type === "full-badge" && (
            <p
              className="mt-1.5 mb-0 w-full overflow-hidden text-[11px] leading-[1.55] text-[#777681] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
              title={badge.description}
            >
              {displayDescription}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
