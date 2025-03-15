//app/lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis;

// 개발 환경에서 Prisma Client를 여러 번 인스턴스화하지 않도록 하기 위해
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;