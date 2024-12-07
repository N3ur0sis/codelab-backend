import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByProviderId = async (providerId: string) => {
  return prisma.user.findUnique({ where: { providerId } });
};

export const createUser = async (userData: {
  username: string;
  email?: string;
  avatarUrl?: string;
  provider: string;
  providerId: string;
  accessToken?: string;
}) => {
  return prisma.user.create({ data: userData });
};
