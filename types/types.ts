export type Badge = {
  id: string;
  name: string;
  description: string;
  maxSteps: number;
  color: string | null;
  svgPath: string | null;
};

export type UserBadge = {
  badge: Badge;
  curSteps: number;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  name: string;
  surname: string;
  biogram: string;
  section: "management" | "development" | "marketing" | null;
  status: "member" | "candidate";
  createdAt: string;
};

export type ProfileWithBadges = Profile & {
  badges: UserBadge[];
};
