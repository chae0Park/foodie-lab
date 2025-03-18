import prisma from "./prisma";

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
        console.log('recipe 데이터: ', recipe);
     }

    return recipe;
}