import prisma from "./prisma";


// recipe랑은 다르게 multi file upload가 가능해야한다

export async function getItems(){
    const items = await prisma.post.findMany({
        where: {
            categories: {
                in: ['ITEM'],
            },
        },
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: {      // User (author) 관계를 포함시키기
                select: {
                    name: true, // author에서 name만 가져오기
                    email: true // 이메일 등 필요한 추가 필드도 선택할 수 있습니다
                }
            },
        },
    });
    //todo: images author 관계형으로 만 생성하지 말고 실질적인 값을 넣어야 가지고 올 때 훨싼 편함 
    // 이미지를 URL만 담은 배열로 변환
  const itemsWithImageUrls = items.map(item => ({
    ...item,
    images: item.images[0].url,  // 각 이미지의 URL만 추출
  }));

  return itemsWithImageUrls;
}