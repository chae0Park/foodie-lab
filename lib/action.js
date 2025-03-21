'use server';
// lib/action.js
import { redirect } from "next/navigation";
import { saveUser } from '@/lib/auth';

//helper function 
function isInvalidText(text){
  return !text || text.trim() === '';
}

  export async function validateUser(prevState, formData){

    const user = {
      email: formData.get('email'),
      password: formData.get('password'),
      name : formData.get('name')
    };


    if(
      isInvalidText(user.email) ||
      isInvalidText(user.password) ||
      isInvalidText(user.name) ||
      !user.email.includes('@')
    ){
      return {
        message: 'Invalid input.'
      };
    }

    await saveUser(user);
    redirect('/auth/signin');
  }
