import { NextResponse } from 'next/server';
import fs from 'node:fs';
import slugify from 'slugify';
import xss from 'xss';
import prisma from '@/lib/prisma';  // prisma import
import { verifyJwf } from '@/lib/jwt';  // jwt verification import

// helper function
function isInvalidText(text) {
  return !text || text.trim() === '';
}

/* next.js 에서 메소드 사용할 때 function 이름으로 명시적으로 나타내야 하고 default가 아닌 export만 사용*/
export async function POST(req) {
  console.log('api/user/recipe/route.js호출');

  // Authorization 헤더 확인
  const authorizationHeader = req.headers.get('Authorization');
  // console.log('리퀘스트 헤더Authorization Header:', req.headers);
  // console.log('그럼 token 값은?:', authorizationHeader);


    const accessToken = authorizationHeader?.split(' ')[1];
    if (!accessToken) {
        return NextResponse.json({ error: 'Missing Token' },{ status: 401 });
        //return console.log('accessToken 없음')

    }else{
      console.log('$$$ accessToken의 값은?', accessToken);
    }

    const user = verifyJwf(accessToken); // JWT 토큰에서 유저 정보 추출

    try {
      const body = await req.json();
      const { title, summary, instructions, imageBase64 } = body;

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
      const slug = slugify(title, { lower: true });
      const sanitizedInstructions = xss(instructions);

      //base64 이미지를 파일로 변환
      const extension = 'jpg'; 
      const fileName = `${slug}.${extension}`;
      const filePath = `public/images/${fileName}`;

      //base64 데이터를 Buffer로 변환 후 파일로 저장
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(filePath, buffer);

      // 이미지 URL 설정
      const imageUrl = `/images/${fileName}`;

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
