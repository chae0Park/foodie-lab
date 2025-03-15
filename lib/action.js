'use server';
// lib/action.js
import { saveMeal } from "./meals";
import { redirect } from "next/navigation";
import { saveUser } from '@/auth';
import { getUser } from '@/auth';

//heler function 
function isInvalidText(text){
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData){

    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions : formData.get('instructions'),
      image: formData.get('image'),
      creator: formData.get('name'),
      creator_email: formData.get('email'),
    };


    if(
      isInvalidText(meal.title) ||
      isInvalidText(meal.summary) ||
      isInvalidText(meal.instructions) ||
      isInvalidText(meal.creator) ||
      isInvalidText(meal.creator_email) ||
      !meal.creator_email.includes('@') ||
      !meal.image || meal.image.size === 0
    ){
      return {
        message: 'Invalid input.'
      };
    }

    await saveMeal(meal);
    redirect('/meals');
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

  export async function validateLogin(prevState, formData){
    
    const loginInfo = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    if(
      isInvalidText(loginInfo.email) ||
      isInvalidText(loginInfo.password) ||
      !loginInfo.email.includes('@')
    ){
      return {
        message: 'Invalid input.'
      };
    }

    await getUser(loginInfo);
    redirect('/');

  }