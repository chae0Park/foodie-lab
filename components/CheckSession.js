'use client';
import { useSession } from "next-auth/react";

export default function CheckSession({children}){
    const { data: session } = useSession();
    if(session && session.user){
        return(
            <>
            {children}
            </>
            
        )
    }
          
}