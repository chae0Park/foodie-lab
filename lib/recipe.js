import prisma from "./prisma";


// create 은 accessToken 확인이 필요해 http request를 처리하는 api생성 

export async function getRecipes(){
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const recipes = await prisma.post.findMany({
        where: {
            categories: {
                in: ['RECIPE'],
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
  const recipesWithImageUrls = recipes.map(recipe => ({
    ...recipe,
    images: recipe.images[0].url,  // 각 이미지의 URL만 추출
  }));


    if(recipesWithImageUrls){
        console.log('recipes 데이터: ', recipesWithImageUrls);
     }

return recipesWithImageUrls;
}

export async function getRecipe(slug){
    const recipe = await prisma.post.findUnique({
        where: {
            slug: slug,
        },
        include: {
            images: true,  // PostImage 관계를 포함시키기
            author: true, 
        },
    });

    recipe.images = recipe.images[0].url;  // 각 이미지의 URL만 추출

    if(recipe){
        // console.log('recipe 데이터: ', recipe);
        console.log('recipe author: ', recipe.author);
        // console.log('recipe image: ', recipe.images);


     }

    return recipe;
}

export async function updateRecipe(slug, updatedRecipe){
    await prisma.post.update({
        where: { slug: slug },
        data: {
            title: updatedRecipe.title,  // 수정된 title
            summary: updatedRecipe.summary,  // 수정된 summary
            instructions: updatedRecipe.instructions,  // 수정된 instructions
            images: updatedRecipe.images ? {
                create: (Array.isArray(updatedRecipe.images) ? updatedRecipe.images : [updatedRecipe.images])
                    .map(imageUrl => ({ url: imageUrl }))
            } : undefined,
            },
            include: {
              images: true,  // 수정 후 images를 포함시켜서 반환
            },
    });
}

export async function deleteRecipe(slug){
    // 데이터 삭제
    await prisma.post.delete({
        where: { slug: slug }
    });
}


