// app/api/recipe/[slug]/route.js 

import { deleteRecipe } from '@/lib/recipe';
import { NextResponse } from 'next/server';
import { redirect } from "next/navigation";

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