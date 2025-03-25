// lib/ auth-provider.js
"use client";
import {  useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AuthProvider = ({ children }) => {
  const { data: session, update } = useSession();


  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.accessToken) {
        const isTokenExpired = checkIfTokenExpired(session.accessToken);
        if (isTokenExpired && refreshToken) {
          await refreshAccessToken();
        }
      }
    }, 10 * 60 * 1000); // 10분마다 액세스 토큰 갱신 확인

    return () => clearInterval(interval);
  }, [session]);

  // 액세스 토큰 만료 확인
  const checkIfTokenExpired = (token) => {
    const { exp } = JSON.parse(atob(token.split('.')[1])); // JWT에서 exp 확인
    return exp * 1000 < Date.now(); // 만료된 경우 true 반환
  };

  // 서버에서 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
  const refreshAccessToken = async () => {
      const res = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: "include", // 쿠키를 포함한 요청
      });

      const data = await res.json();
      if (data.accessToken) {
        update({
          ...session,
          accessToken: data.accessToken, // 갱신된 액세스 토큰 설정
        });
      }else{
        alert('Session expired. Please log in again.');
        window.location.href = '/auth/signin';
      }
  };

  return <>{children}</>;
};

export default AuthProvider;


/*
credentials: "include"는 fetch 요청을 보낼 때 쿠키를 포함하도록 설정하는 옵션
3가지 옵션이 있다 
1. same-origin (기본값):  요청이 같은 출처(origin)에서 이루어질 때만 쿠키를 포함시킵니다.
2. include: 모든 요청에 대해 쿠키를 포함시킵니다
3. omit: 쿠키를 요청에 포함시키지 않습니다
*/