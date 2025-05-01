// app/api/ws/route.ts
import { Server } from 'socket.io'; 
import { PrismaClient, Chat, ChatRoom } from '@prisma/client';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/chat'; 

const prisma = new PrismaClient();

interface JoinRoomPayload {
  userIds: number[]; // [userId1, userId2]
  senderId: number; // 누가 메시지를 보냈는지
  message: string; // 메시지 내용
}

// Next.js API Routes에서 Socket.io 서버를 초기화 : Socket.io는 HTTP POST body를 사용하지 않기 때문에 bodyParser가 동작하면 에러가 발생하거나 WebSocket handshake가 제대로 되지 않을 수 있음
export const config = {
  api: {
    bodyParser: false,
  },
};



export default async function handler (
  req: NextApiRequest,
  res: NextApiResponseServerIO 
) {
  if (req.method === 'GET') {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
    
    
        io.on('connection', (socket) => {
            console.log('🔌 New client connected:', socket.id);
    
            // ✅ 1. 채팅방 찾기
            socket.on('joinRoom', async ({ userIds, senderId, message }: JoinRoomPayload) => {
            const [userId1, userId2] = userIds;
            //data 조회 시 null이 나올 수 있으므로 null 필요
            let chatRoom: ChatRoom | null = await prisma.chatRoom.findFirst({
                where: {
                members: {
                    every: {
                    id: { in: [userId1, userId2] }
                    }
                }
                },
                include: {
                members: true,
                },
            });
    
            //2. 없으면 만들고 
            if (!chatRoom) {
                chatRoom = await prisma.chatRoom.create({
                data: {
                    name: `${userId1} - ${userId2}`,
                    members: {
                    connect: [
                        { id: userId1 },
                        { id: userId2 },
                    ],
                    },
                }
                });
            }
    
            //3. 방에 들어가기
            socket.join(String(chatRoom.id));
    
            // DB에 저장
            const savedMessage: Chat = await prisma.chat.create({
                data: {
                content: message,
                chatRoom: { connect: { id: chatRoom.id } },
                user: { connect: { id: senderId } },
                },
            });
    
            // 해당 채팅방(Room)에 있는 사람들에게만 전송
            io.to(String(chatRoom.id)).emit('message', savedMessage);
            });
    
            // ✅ (옵션) 클라이언트 연결 해제 시 로그
            socket.on('disconnect', () => {
            console.log('🔌 Client disconnected:', socket.id);
            });
        });
    
        res.socket.server.io = io;
        }
    

    res.end();
  }
}


/*
2025-05-02
// app/api/socket/route.ts
import { Server as SocketIOServer } from 'socket.io';
import { NextResponse } from 'next/server';
import { PrismaClient, Chat, ChatRoom, User } from '@prisma/client';

const prisma = new PrismaClient();

// Extend the NodeJS global type
declare global {
  var socketIOServer: SocketIOServer | undefined;
}

interface JoinRoomPayload {
  userIds: number[];
  senderId: number;
  message: string;
}

interface GetPreviousMessagesPayload {
  userIds: number[];
}

export async function GET() {
  try {
    const response = NextResponse.next();
    
    if (!response.socket?.server) {
      return NextResponse.json(
        { error: 'Socket server not available' }, 
        { status: 500 }
      );
    }
    
    // Check if socket.io server is already initialized
    if (!global.socketIOServer) {
      console.log('Initializing Socket.io server...');
      
      // Create new Server instance
      const io = new SocketIOServer(response.socket.server);
      
      io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        
        // Handle getting previous messages
        socket.on('getPreviousMessages', async (payload: GetPreviousMessagesPayload) => {
          try {
            const { userIds } = payload;
            const [userId1, userId2] = userIds;
            
            // Find the chat room
            const chatRoom = await prisma.chatRoom.findFirst({
              where: {
                AND: [
                  {
                    members: {
                      some: {
                        id: userId1
                      }
                    }
                  },
                  {
                    members: {
                      some: {
                        id: userId2
                      }
                    }
                  }
                ]
              },
            });
            
            if (chatRoom) {
              // Get messages from this chat room
              const messages = await prisma.chat.findMany({
                where: {
                  chatRoomId: chatRoom.id
                },
                orderBy: {
                  createdAt: 'asc'
                },
                include: {
                  user: {
                    select: {
                      name: true
                    }
                  }
                }
              });
              
              socket.emit('previousMessages', messages);
            } else {
              // No previous messages
              socket.emit('previousMessages', []);
            }
          } catch (error) {
            console.error('Error getting previous messages:', error);
            socket.emit('error', { message: 'Failed to load previous messages' });
          }
        });
        
        // Handle join room event
        socket.on('joinRoom', async (payload: JoinRoomPayload) => {
          try {
            const { userIds, senderId, message } = payload;
            const [userId1, userId2] = userIds;
            
            // Find existing chat room or create a new one
            let chatRoom = await prisma.chatRoom.findFirst({
              where: {
                AND: [
                  {
                    members: {
                      some: {
                        id: userId1
                      }
                    }
                  },
                  {
                    members: {
                      some: {
                        id: userId2
                      }
                    }
                  }
                ]
              },
              include: {
                members: true,
              },
            });
            
            // Create a new chat room if one doesn't exist
            if (!chatRoom) {
              chatRoom = await prisma.chatRoom.create({
                data: {
                  name: `Chat between ${userId1} and ${userId2}`,
                  members: {
                    connect: [
                      { id: userId1 },
                      { id: userId2 },
                    ],
                  },
                },
                include: {
                  members: true,
                },
              });
            }
            
            // Join the socket room
            socket.join(String(chatRoom.id));
            
            // Save the message to the database
            const savedMessage = await prisma.chat.create({
              data: {
                content: message,
                chatRoomId: chatRoom.id,
                userId: senderId,
              },
              include: {
                user: {
                  select: {
                    name: true,
                  }
                }
              }
            });
            
            // Broadcast the message to everyone in the room
            io.to(String(chatRoom.id)).emit('message', savedMessage);
          } catch (error) {
            console.error('Error in joinRoom:', error);
            socket.emit('error', { message: 'Failed to process chat message' });
          }
        });
        
        // Handle disconnect event
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
      
      // Store io server in global object for reuse
      global.socketIOServer = io;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize socket' }, 
      { status: 500 }
    );
  }
}

*/