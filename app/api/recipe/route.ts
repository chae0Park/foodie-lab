//api/recipe/route.js
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import slugify from 'slugify';
import xss from 'xss';
import prisma from '@/lib/prisma';  // prisma import
import { verifyJwf } from '@/lib/jwt';  // jwt verification import
import kroman from 'kroman';

// helper function
function isInvalidText(text: string): boolean {
  return !text || text.trim() === '';
}

let slug:string;

function generateUniqueSlug(title: string): string {
  const baseSlug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
  const randomSuffix = Math.floor(Math.random() * 10000);
  return slug = `${baseSlug}-${randomSuffix}`;
}

interface RecipeRequestBody {
  title: string;
  instructions: string;
  imageBase64: string;
  youtubeLink?: string;
  ingredients: string;
  totalCost?: string;
  totalTime?: string;
}

interface JwtUser {
  id: number;
  email: string;
  name: string;
  // Add other properties as needed
}


/* next.js 에서 메소드 사용할 때 function 이름으로 명시적으로 나타내야 하고 default가 아닌 export만 사용*/
export async function POST(req: NextRequest) {
  console.log('api/recipe/route.js호출');

  // Authorization 헤더 확인
  const authorizationHeader: string | null = req.headers.get('Authorization');

    const accessToken = authorizationHeader?.split(' ')[1];
    if (!accessToken) {
        return NextResponse.json({ error: 'Missing Token' },{ status: 401 });
    }else{
      console.log('$$$ accessToken의 값은?', accessToken);
    }

    const user = verifyJwf(accessToken) as JwtUser; 

    try {
      const body: RecipeRequestBody = await req.json();
      const { title, instructions, imageBase64, youtubeLink, ingredients, totalCost, totalTime } = body;

      // Validation
      if (
        isInvalidText(title) ||
        isInvalidText(ingredients) ||
        isInvalidText(instructions) ||
        !imageBase64
      ) {
        return NextResponse.json({ message: 'Invalid input' }, {status : 400});
      }

      // Slug 및 XSS 처리
      const kromanTitle = kroman.parse(title);
      slug = slugify(kromanTitle, { lower: true });
      const sanitizedInstructions = xss(instructions);

      //base64 이미지를 파일로 변환
      const extension = 'jpg'; 
      const now = new Date();
      const dateString = now.toISOString().replace(/[-:]/g, "").split('.')[0];  // "2025-03-19T10:30:45" 형식을 "20250319T103045"로 변환
      const fileName = `${slug}-${dateString}.${extension}`;
      const filePath = `public/images/${fileName}`;

      //base64 데이터를 Buffer로 변환 후 파일로 저장
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      // 이미지 URL 설정
      const imageUrl = `/images/${fileName}`;

      if(totalCost){
        console.log('💰totalCost',totalCost);
      }

      // Prisma로 데이터 저장-----------------------------------------------
      //저장 전 중복 슬러그 체크 
      const existingItemSlug = await prisma.item.findUnique({
        where: { slug },
      });

      if(existingItemSlug){
        generateUniqueSlug(slug);
      }


      const newRecipe = await prisma.recipe.create({
        data: {
          title,
          slug,
          ingredients,
          instructions: sanitizedInstructions,
          author: {
              connect : {id : user.id},
          },
          ...(youtubeLink ? { youtubeLink } : {}),
          ...(totalCost && { totalCost }), 
          ...(totalTime && { totalTime }), 
        },
      });

      //post인 recipe의 id가 생성된 후 이미지 저장 
      await prisma.image.create({
          data: {
              url: imageUrl,
              type: 'RECIPE',
              recipeId: newRecipe.id
          },
      });

      return NextResponse.json({ message: 'Meal shared successfully!', newRecipe }, {status: 200});

    } catch (error) {
      console.error(error);
      NextResponse.json({ message: 'Error saving meal', error }, {status: 500});

    }
  
  }
