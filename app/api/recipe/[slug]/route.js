// app/api/recipe/[slug]/route.js 

import { deleteRecipe, updateRecipe } from '@/lib/recipe';
import { NextResponse } from 'next/server';
import { verifyJwf } from '@/lib/jwt';  // jwt verification import
import fs from 'node:fs';
// import { redirect } from "next/navigation";


// helper function
function isInvalidText(text) {
  return !text || text.trim() === '';
}

export async function DELETE(request) {
  const url = new URL(request.url);  // 요청 URL 객체를 생성
  const slug = url.pathname.split('/')[3];  // 슬러그는 URL 경로에서 3번째 부분에 위치
  console.log('delete api에 전달된 slug:', slug);

  try {
    await deleteRecipe(slug);  // 삭제 함수 호출
    return NextResponse.redirect(new URL('/meals', request.url));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return new NextResponse('Error deleting recipe', { status: 500 });
  }
}


/*
[slug] 를 이용해 slug값을 추출하지 못하는 상황이라 dir를 
app/api/recipe/route.js 로 수정해도 됨. 

그렇다면 

[문제]
api에서 [slug]를 이용해 slug의 값을 추출하는 방법은?
*/

//수정하기 api만들기 
export async function PUT(req) {
  console.log('api/recipe/[slug]/route.js호출');

  //authentication 검사 먼저 하고 
  const authorizationHeader = req.headers.get('Authorization');
  const accessToken = authorizationHeader?.split(' ')[1];
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing Token' }, { status: 401 });
    //return console.log('accessToken 없음')

  } else {
    console.log('$$$ accessToken의 값은?', accessToken);
  }

  const user = verifyJwf(accessToken); // JWT 토큰에서 유저 정보 추출

  //바디에 데이터 잘 실려왔는지 확인 
  const body = await req.json();
  console.log('바디에 데이터 잘 실려왔는지 확인:', body);
  

  //validation
  //const { title, slug, summary, instructions, imageBase64 } = body;
  // if (
  //       isInvalidText(title) || !slug ||
  //       
  //       isInvalidText(summary) ||
  //       isInvalidText(instructions) || !imageBase64
  //       
  //     ) {
  //       return NextResponse.json({ message: 'Invalid input' }, {status : 400});
  // }

  const slug = body.slug

  //레시피 데이터 업데이트트
  const updatedData = {
    title: body.title,
    summary: body.summary,
    instructions: body.instructions,
  };

  let imageBase64;
  if(body.imageBase64){
    imageBase64 = body.imageBase64;
  }

  //이미지 저장
  let imageUrl;
  if (imageBase64) {
    const extension = 'jpg';
    const now = new Date();
    const dateString = now.toISOString().replace(/[-:]/g, "").split('.')[0];  // "2025-03-19T10:30:45" 형식을 "20250319T103045"로 변환
    const fileName = `${slug}-${dateString}.${extension}`;
    const filePath = `public/images/${fileName}`;

    const buffer = Buffer.from(imageBase64, 'base64');  // base64를 buffer로 변환
    await fs.promises.writeFile(filePath, buffer);

    // 이미지 URL 설정
    imageUrl = `/images/${fileName}`;

    updatedData.images = imageUrl;
      
  }

  try {  

    await updateRecipe(slug, updatedData);

    // 성공적으로 수정한 경우
    return NextResponse.json({
      message: "Recipe updated successfully",
      data: updatedData,
  });
  } catch (err) {
    console.error('Error updating recipe:', err);
    return NextResponse.json({ message: 'Failed to update recipe' }, { status: 500 });
  }
  
}
