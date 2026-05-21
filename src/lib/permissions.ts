import type { UserRole } from "@prisma/client";

export function isModerator(role?: UserRole | string | null): boolean {
  return role === "MOD" || role === "ADMIN";
}

export function canDeletePost(
  role: UserRole | string | null | undefined,
  userId: string | undefined,
  authorId: string,
): boolean {
  if (!userId) return false;
  if (isModerator(role)) return true;
  return userId === authorId;
}

export function canDeleteComment(
  role: UserRole | string | null | undefined,
  userId: string | undefined,
  authorId: string,
): boolean {
  return canDeletePost(role, userId, authorId);
}
