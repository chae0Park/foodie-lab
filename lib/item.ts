import prisma from "./prisma";
import { Item } from "@prisma/client";


type ItemWithImagesAndAuthor = Item & {
    images: { 
        id: number;
        url: string 
    }[];
    
    author: {
      name: string;
      email: string;
    };
  };


  type UpdatedData = {
    title: string;
    price: string;
    instructions: string;
    tradeType: string;
    itemType: string;
    images?: string | string[];
  };
  

//전체 아이템 불러오기
export async function getItems(){
    const items: ItemWithImagesAndAuthor[] = await prisma.item.findMany({
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: {      // User (author) 관계를 포함시키기
                select: {
                    name: true, // author에서 name만 가져오기
                    email: true // 이메일 등 필요한 추가 필드도 선택할 수 있습니다
                }
            },
            //todo: 좋아요 포함
        },
    });
    // 이미지를 URL만 담은 배열로 변환
  const itemsWithImageUrls = items.map(item => ({
    ...item,
    images: item.images[0]?.url,  // 각 이미지의 URL만 추출
  }));

  return itemsWithImageUrls;
}

//특정 아이템 불러오기
export async function getItem(slug: string){
    const item = await prisma.item.findUnique({
        where: {
            slug: slug,
        },
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: true, 
        },
    });

    item.images = item.images[0].url;  // 각 이미지의 URL만 추출

    if(item){
        console.log('item 데이터: ', item);
        // console.log('recipe author: ', recipe.author);
        // console.log('recipe image: ', recipe.images);
     }

    return item;
}

// 아이템 수정 
export async function updateItem(slug: string , updatedItem: UpdatedData){
    console.log('updatedRecipe db로 전달된 데이터:', updatedItem);
    const item: ItemWithImagesAndAuthor = await prisma.item.findUnique({
        where: {
            slug: slug,
        },
        include: {
            images: true,  
            author: true, 
        },
    });

    console.log('slug로 찾은 레시피의 이미지 아이디: ', item.images[0].id);

    await prisma.item.update({
        where: { slug: slug },
        data: {
            title: updatedItem.title,  // 수정된 title
            price: updatedItem.price,  // 수정된 price
            instructions: updatedItem.instructions,  // 수정된 instructions
            tradeType: updatedItem.tradeType,  // 수정된 tradeType
            itemType: updatedItem.itemType,  // 수정된 itemType
            images: updatedItem.images ? {
                update: (Array.isArray(updatedItem.images) ? updatedItem.images : [updatedItem.images])
                    .map(imageUrl => ({
                        where: { id: item.images[0].id }, // postId로 이미지를 찾음
                        data: { url: imageUrl },  // 이미지를 새로운 URL로 수정
                    }))
            } : undefined,
            },
            include: {
              images: true,  // 수정 후 images를 포함시켜서 반환
            },
        });
}

export async function deleteItem(slug: string){
    // 데이터 삭제
    await prisma.item.delete({
        where: { slug: slug }
    });
}

