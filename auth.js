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
    console.log('User saved', newUser.name);
}

