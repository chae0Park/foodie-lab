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

export async function getItem(slug){
    const item = await prisma.post.findUnique({
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

export async function updateItem(slug, updatedItem){
    console.log('updatedRecipe db로 전달된 데이터:', updatedItem);
    const item = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: true, 
        },
    });

    console.log('slug로 찾은 레시피의 이미지 아이디: ', item.images[0].id);

    await prisma.post.update({
        where: { slug: slug },
        data: {
            title: updatedItem.title,  // 수정된 title
            summary: updatedItem.summary,  // 수정된 summary
            instructions: updatedItem.instructions,  // 수정된 instructions
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

export async function deleteItem(slug){
    // 데이터 삭제
    await prisma.post.delete({
        where: { slug: slug }
    });
}

