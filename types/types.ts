export type BadgeType = {
  id: string;
  name: string;
  description: string;
  maxSteps: number;
  color: string | null;
  svgPath: string | null;
};

export type UserBadgeType = {
  badgeId: string;
  curSteps: number;
  createdAt: string;
  updatedAt: string;
};

export type ProfileType = {
  id: string;
  name: string;
  surname: string;
  biogram: string;
  section: "management" | "development" | "marketing" | null;
  status: "member" | "candidate";
  createdAt: string;
};

export type ProfileWithBadgesType = ProfileType & {
  userBadges: UserBadgeType[];
};
