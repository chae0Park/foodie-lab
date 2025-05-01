import { PrismaClient, Message } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<Message[] | { error: string }>
) {
  if (req.method === 'GET') {
    try{
      const messages: Message[] = await prisma.message.findMany({
        orderBy: { createdAt: 'asc' },
      });
      res.status(200).json(messages);

    }catch(error){
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }else{
    res.status(405).json({ error: 'Method not allowed'});

  }
}
