//api/community/route.js
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import slugify from 'slugify';
import xss from 'xss';
import prisma from '@/lib/prisma';  // prisma import
import { verifyJwf } from '@/lib/jwt';  // jwt verification import
import kroman from 'kroman';

// helper function
function isInvalidText(text) {
  return !text || text.trim() === '';
}

/* next.js 에서 메소드 사용할 때 function 이름으로 명시적으로 나타내야 하고 default가 아닌 export만 사용*/
export async function POST(req) {
  console.log('api/community/route.js호출');

  // Authorization 헤더 확인
  const authorizationHeader = req.headers.get('Authorization');

    const accessToken = authorizationHeader?.split(' ')[1];
    if (!accessToken) {
        return NextResponse.json({ error: 'Missing Token' },{ status: 401 });
        //return console.log('accessToken 없음')

    }else{
      console.log('$$$ accessToken의 값은?', accessToken);
    }

    const user = verifyJwf(accessToken); 

    try {
      const body = await req.json();
      const { title, summary, instructions, imageBase64, path } = body;
      console.log('community-body의 값은?', body);
      // Validation
      if (
        isInvalidText(title) ||
        isInvalidText(summary) ||
        isInvalidText(instructions) ||
        !imageBase64
      ) {
        return NextResponse.json({ message: 'Invalid input' }, {status : 400});
      }

      // Slug 및 XSS 처리
      const kromanTitle = kroman.parse(title);
      const slug = slugify(kromanTitle, { lower: true });
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

      //카테고리 설정 
      let category;
      if(path.includes('nearbuy')){
        category = 'ITEM';
      }else if(path.includes('events')){
        category = 'EVENT';
      }

      // Prisma로 데이터 저장
      const newRecipe = await prisma.post.create({
        data: {
          title,
          slug,
          summary,
          author: {
              connect : {id : user.id},
          },
          instructions: sanitizedInstructions,
          categories: category,
        },
      });

      //post인 recipe의 id가 생성된 후 이미지 저장 
      await prisma.postImage.create({
          data: {
              url: imageUrl,
              postId: newRecipe.id
          },
      });

      return NextResponse.json({ message: 'Meal shared successfully!', newRecipe }, {status: 200});

    } catch (error) {
      console.error(error);
      NextResponse.json({ message: 'Error saving meal', error }, {status: 500});

    }
  
  }
