'use server';
// lib/action.js
import { redirect } from "next/navigation";
import { saveUser } from '@/lib/auth';

//helper function 
function isInvalidText(text: string): boolean {
  return !text || text.trim() === '';
}

export async function validateUser(
  prevState: { message: string | null },
  formData: FormData
): Promise<{ message: string | null }> {
  const user = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string
  };

  if (
    isInvalidText(user.email) ||
    isInvalidText(user.password) ||
    isInvalidText(user.name) ||
    !user.email.includes('@')
  ) {
    return {
      message: 'Invalid input.'
    };
  }

  await saveUser(user);
  redirect('/auth/signin');
}