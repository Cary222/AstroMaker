import { prisma } from "@/lib/db";
import type { ModerationAction } from "@prisma/client";

export async function createModerationLog({
  action,
  targetId,
  targetType,
  actorId,
  reason,
}: {
  action: ModerationAction;
  targetId: string;
  targetType: string;
  actorId: string;
  reason?: string;
}) {
  return prisma.moderationLog.create({
    data: {
      action,
      targetId,
      targetType,
      actorId,
      reason,
    },
  });
}

export type ModerationLogWithActor = {
  id: string;
  action: string;
  targetId: string;
  targetType: string;
  reason: string | null;
  createdAt: Date;
  actor: {
    id: string;
    name: string | null;
    email: string;
  };
};

export async function getModerationLogs(limit = 50): Promise<ModerationLogWithActor[]> {
  return prisma.moderationLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}
