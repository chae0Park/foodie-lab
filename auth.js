// auth.js 
import prisma from "./lib/prisma";
import * as bcrypt from 'bcrypt'

export async function saveUser(user){
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: await bcrypt.hash(user.password,  10),
            name: user.name,
        },
    });
    console.log('User saved', newUser);
}

export async function getUser(loginInfo){
    // By unique identifier
    const user = await prisma.user.findFirst({
        where: {
          email: loginInfo.email,
        },
      });

    if (user && (await bcrypt.compare(loginInfo.password, user.password))) {
        const { password, ...userWithoutPass } = user
        return new Response(JSON.stringify(userWithoutPass))
    } else return new Response(JSON.stringify(null))
}


