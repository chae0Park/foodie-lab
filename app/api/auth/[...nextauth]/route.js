// app/ api/ auth/ [...nextauth]/ route.js 
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
      // ID, PW 로그인 방식
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const res = await fetch(`&{process.env.NEXTAUTH_URL}/api/login`, {
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
})

export { handler as GET, handler as POST }