// app/ api/ auth/ [...nextauth]/ route.js 
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'


export const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                console.log(credentials);
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, { //api 폴더명을 꼭 login으로 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password,
                    }),
                })
                const user = await res.json()
                console.log('$$$user: ', user)

                if (user) {
                    return user
                } else {
                    return null

                }
            },
        }),
    ],
    callbacks:{
        //token정보와 user정보를 하나의 obj로 리턴
        async jwt({token, user}){
            return {...token, ...user};
        },
        async session({session, token}){
            console.log('$$$ token', token);
            session.user = token;
            console.log('$$$ session: ', session)
            return session;
        },
    },
    session: {
        strategy: "jwt", // JWT 세션 사용 설정
    },
    pages: {
        signIn: "/auth/signin",  // 로그인 페이지 경로 설정 (옵션)
    },
})

export { handler as GET, handler as POST }