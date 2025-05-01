// lib > auth.js 
import prisma from "./prisma";
import * as bcrypt from 'bcrypt'

export async function saveUser(user: { email: string; password: string; name: string }){
    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: await bcrypt.hash(user.password,  10),
            name: user.name,
        },
    });
    console.log('User saved', newUser.name);
}

//이외의 모든 data crud는 jwt를 보내 멤버임이 입증 되고 나서야 할 수 있음 -> api 생성 후 프론트와 http req,res 주고 받음 