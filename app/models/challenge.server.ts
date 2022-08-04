import type { User, Challenge } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Challenge } from "@prisma/client";

export function getChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & {
  userId: Challenge["id"];
}) {
  return prisma.challenge.findFirst({
    select: { id: true, description: true, title: true },
    where: { id, userId },
  });
}

export function getChallenges({ userId }: { userId: User["id"] }) {
  return prisma.challenge.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createChallenge({
  description,
  title,
  userId,
}: Pick<Challenge, "description" | "title"> & {
  userId: User["id"];
}) {
  return prisma.challenge.create({
    data: { title, description, user: { connect: { id: userId } } },
  });
}

export function updateChallenge({
  id,
  description,
  title,
  userId,
}: Pick<Challenge, "description" | "title" | "id"> & {
  userId: User["id"];
}) {
  return prisma.challenge.update({
    data: { title, description, user: { connect: { id: userId } } },
    where: { id },
  });
}

export function deleteChallenge({
  id,
  userId,
}: Pick<Challenge, "id"> & { userId: User["id"] }) {
  return prisma.challenge.deleteMany({
    where: { id, userId },
  });
}
