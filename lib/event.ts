import prisma from "./prisma";
import { Event } from '@prisma/client';

type EventWithImagesAndAuthor = Event & {
    images: { 
        id: number;
        url: string 
    }[];
    
    author: {
      name: string;
      email: string;
    };
}

type UpdatedData = {
    title: string;
    time: string;
    address: string;
    instructions: string;
    fee: string;
    estimatedTime: string;
    images?: string | string[];
  };


//전체 이벤트 불러옴 
export async function getEvents(){
    const events:EventWithImagesAndAuthor[] = await prisma.event.findMany({
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: {      // User (author) 관계를 포함시키기
                select: {
                    name: true, // author에서 name만 가져오기
                    email: true // 이메일 등 필요한 추가 필드도 선택할 수 있습니다
                }
            },
            //todo: like포함하기
        },
    });

    // 이미지를 URL만 담은 배열로 변환
  const eventsWithImageUrls = events.map(ev => ({
    ...ev,
    images: ev.images[0]?.url,  // 각 이미지의 URL만 추출
  }));

  return eventsWithImageUrls;
}


//특정 이벤트 불러오기 
export async function getEvent(slug: string){
    const event = await prisma.event.findUnique({
        where: {
            slug: slug,
        },
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: true, 
        },
    });

    event.images = event.images[0].url;  // 각 이미지의 URL만 추출

    if(event){
        console.log('item 데이터: ', event);
      
     }

    return event;
}

//이벤트 수정 
export async function updateEvent(slug: string , updatedItem: UpdatedData){
    console.log('updatedRecipe db로 전달된 데이터:', updatedItem);
    const event: EventWithImagesAndAuthor = await prisma.event.findUnique({
        where: {
            slug: slug,
        },
        include: {
            images: true,  
            author: true, 
        },
    });

    console.log('slug로 찾은 레시피의 이미지 아이디: ', event.images[0].id);

    await prisma.event.update({
        where: { slug: slug },
        data: {
            title: updatedItem.title,
            time: updatedItem.time,  
            address: updatedItem.address, 
            instructions: updatedItem.instructions, 
            fee: updatedItem.fee,  
            images: updatedItem.images ? {
                update: (Array.isArray(updatedItem.images) ? updatedItem.images : [updatedItem.images])
                    .map(imageUrl => ({
                        where: { eventId: event.id }, // 
                        data: { url: imageUrl },  // 이미지를 새로운 URL로 수정
                    }))
            } : undefined,
            },
            include: {
              images: true,  // 수정 후 images를 포함시켜서 반환
            },
        });
}


export async function deleteEvent(slug: string){
    // 데이터 삭제
    await prisma.event.delete({
        where: { slug: slug }
    });
}