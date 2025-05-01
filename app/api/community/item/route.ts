//api/community/route.js
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import slugify from 'slugify';
import xss from 'xss';
import prisma from '@/lib/prisma';  // prisma import
import { verifyJwf } from '@/lib/jwt';  // jwt verification import
import kroman from 'kroman';
import { Item } from '@prisma/client'; // Prisma에서 생성된 타입


interface JwtPayload{
  id: string;
};

//helper function
function isInvalidText(text: string ): boolean {
  return !text || text.trim() === '';
}

let slug:string;

function generateUniqueSlug(title: string): string {
  const baseSlug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
  const randomSuffix = Math.floor(Math.random() * 10000);
  return slug = `${baseSlug}-${randomSuffix}`;
}

/* next.js 에서 메소드 사용할 때 function 이름으로 명시적으로 나타내야 하고 default가 아닌 export만 사용*/
export async function POST(req: NextRequest):Promise<NextResponse> {
  console.log('api/community/route.js호출');

  // Authorization 헤더 확인
  const authorizationHeader:(string | null) = req.headers.get('Authorization');

    const accessToken = authorizationHeader?.split(' ')[1];
    if (!accessToken) {
        return NextResponse.json({ error: 'Missing Token' },{ status: 401 });
        //return console.log('accessToken 없음')

    }else{
      console.log('$$$ accessToken의 값은?', accessToken);
    }

    const user = verifyJwf(accessToken) as JwtPayload; 

    try {
      const body: {[key : string] : string} = await req.json();
      console.log('body의 값은?', body);
      const { title, tradeType, itemType, price, instructions, imageBase64 } = body;
      console.log('community-body의 값은?', body);
      // Validation
      if (
        isInvalidText(title) ||
        isInvalidText(tradeType) ||
        isInvalidText(itemType) ||
        isInvalidText(price) ||
        isInvalidText(instructions) ||
        !imageBase64
      ) {
        return NextResponse.json({ message: 'Invalid input' }, {status : 400});
      }

      // Slug 및 XSS 처리
      const kromanTitle: string = kroman.parse(title);
      slug = slugify(kromanTitle, { lower: true });
      const sanitizedInstructions = xss(instructions);

      //base64 이미지를 파일로 변환
      const extension: string = 'jpg'; 
      const now = new Date();
      const dateString = now.toISOString().replace(/[-:]/g, "").split('.')[0];  // "2025-03-19T10:30:45" 형식을 "20250319T103045"로 변환
      const fileName = `${slug}-${dateString}.${extension}`;
      const filePath = `public/images/${fileName}`;

      //base64 데이터를 Buffer로 변환 후 파일로 저장
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      // 이미지 URL 설정
      const imageUrl = `/images/${fileName}`;

      
       // Prisma로 데이터 저장-----------------------------------------------
        //저장 전 중복 슬러그 체크 
        const existingItemSlug = await prisma.item.findUnique({
          where: { slug },
        });
  
        if(existingItemSlug){
          generateUniqueSlug(slug);
        }

        const newItem:Item = await prisma.item.create({
          data: {
            title,
            slug,
            tradeType,
            itemType,
            price,
            author: {
                connect : {id : user.id},
            },
            instructions: sanitizedInstructions,
          },
        });
  
        //post인 recipe의 id가 생성된 후 이미지 저장 
        await prisma.image.create({
            data: {
                url: imageUrl,
                type: 'ITEM',
                itemId: newItem.id
            },
        });

      return NextResponse.json({ message: 'Meal shared successfully!', newItem }, {status: 200});

    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error saving meal', error }, {status: 500});

    }
  
  }
