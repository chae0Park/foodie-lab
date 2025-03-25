'use client';
import { useSession } from "next-auth/react";
import { notFound } from 'next/navigation';

export default function CheckAccessToken({ children }) {
  const { data: session, status } = useSession();

  // 로딩 중에는 session이 undefined일 수 있으므로 이를 처리합니다.
  if (status === "loading") {
    return <p>Loading...</p>; // 또는 로딩 상태에 맞는 다른 UI를 반환할 수 있습니다.
  }

  // 세션이 없으면 notFound 호출
  if (!session || !session.user || !session.user.accessToken) {
    notFound();
  }

  return <>{children}</>;
}
