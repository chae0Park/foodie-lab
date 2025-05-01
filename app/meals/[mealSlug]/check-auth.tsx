'use client';
import { ReactNode } from 'react';
import { useSession } from "next-auth/react";

interface CheckSessionProps {
    children: ReactNode;
    authorEmail: string;
  }

export default function CheckSession({ children, authorEmail }: CheckSessionProps) {
    const { data: session } = useSession();

    if (session && session.user && session.user.email === authorEmail) {
        return <>{children}</>;  // children을 JSX로 올바르게 감싸서 반환
    }
               
}
