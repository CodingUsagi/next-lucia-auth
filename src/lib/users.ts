import { prisma } from "../db/db";

export async function createUser(email: string, hashedPassword: string) {
  return await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });
}

export function getUserByEmail(email: string) {
  return prisma.user.findFirst({ where: { email } });
}
