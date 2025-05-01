'use client';
import { useSession } from "next-auth/react";
import { notFound } from 'next/navigation';

interface CheckAccessTokenProps {
  children: React.ReactNode;
}

export default function CheckAccessToken({ children }: CheckAccessTokenProps) {
  const { data: session, status } = useSession();

  // 로딩 중에는 session이 undefined일 수 있으므로 이를 처리합니다.
  if (status === "loading") {
    return <p>Loading...</p>; // 또는 로딩 상태에 맞는 다른 UI를 반환할 수 있습니다.
  }

  // 세션이 없으면 notFound 호출  global.d.ts User에 accessToken정의 해둠 
  if (!session || !session.user || !session.user.accessToken) {
    notFound();
  }

  return <>{children}</>;
}
