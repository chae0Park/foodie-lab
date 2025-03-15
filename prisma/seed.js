// prisma/seed.js

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); 

const prisma = new PrismaClient();

async function main() {
  // 유저 데이터 생성 예시
  const user = await prisma.user.create({
    data: {
      email: 'user3@example.com',
      password: 'password123',
      name: 'Test User3',
    },
  });

  console.log('Mock user created:', user);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
