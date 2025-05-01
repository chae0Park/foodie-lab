'use client';
import { useSession } from "next-auth/react";

interface CheckAccessTokenProps {
    children: React.ReactNode;
    authorEmail?: string;
  }

export default function CheckSession({children, authorEmail}: CheckAccessTokenProps) {
    const { data: session } = useSession();
    if(session && session.user){
        return(
            <>
            {children}
            </>
            
        )
    }
          
}