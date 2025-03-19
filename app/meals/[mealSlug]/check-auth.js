'use client';
import { useSession } from "next-auth/react";

export default function CheckSession({ children, authorEmail }) {
    const { data: session } = useSession();

    if (session && session.user && session.user.email === authorEmail) {
        return <>{children}</>;  // children을 JSX로 올바르게 감싸서 반환
    }
               
}
