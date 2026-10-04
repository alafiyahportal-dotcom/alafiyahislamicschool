import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Only log errors in all environments — query logging is expensive
    log: ['error'],
  });

// Keep singleton across hot-reloads in dev
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
