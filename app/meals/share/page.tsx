'use client';

import classes from './page.module.css';
import ImagePicker from '@/components/meals/image-picker';
import { notFound } from 'next/navigation';
import { useSession } from "next-auth/react";
import SubmitButton from '@/components/submit-button'
import React from 'react';
import Input from '@/components/input';


type FormDataObj = {
  [key: string]: FormDataEntryValue;
};

export default function ShareMealPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const accessToken = session?.user.accessToken;
  if(!accessToken){
    notFound();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  

    if(!accessToken){
      console.error('No accessToken');
    }else{
      console.log('accessToken 값은?', accessToken);
    }

    // 폼 데이터를 FormData 객체로 가져옴
    const formData = new FormData(e.target as HTMLFormElement);  // e.target은 현재 폼을 가리킴
    const formDataObj:FormDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    console.log("formData 객체", formDataObj);

    //이미지 파일을 바이너리 (01010100)에서 문자형태로 변환한다 = base64
    const image = formDataObj.image;
    const reader = new FileReader();
    if(image instanceof File){
      reader.readAsDataURL(image);

      reader.onload = async () => {
        const result = reader.result;
        let  imageBase64;
        if(typeof result === 'string'){
          imageBase64 = result.split(',')[1]; 
        }
  
  
        // fetch로 폼 데이터를 전송
        const response = await fetch('/api/recipe', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,  // JWT 토큰을 헤더에 포함시켜 전송
            'Content-Type' : 'application/json', //데이터는 multipart/formData 가 아닌 json형식으로 전송
          },
          body: JSON.stringify({
             ...formDataObj,
             ...(formDataObj.youtubeLink ? { youtubeLink: formDataObj.youtubeLink } : {}),
            imageBase64,
          }),  // FormData를 요청의 body로 전달
        });
        if (response.ok) {
          // 성공 시 리디렉션
          window.location.href = '/meals';  
        } else {
          // 오류 처리
          console.error('폼 제출 실패');
        }
      };

    }
  };

 

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.row}>
              {session && session.user &&  <Input type={'text'} name={'name'} label={'Name'} value={session.user.name ?? ''} />} 
              {session && session.user &&  <Input type={'email'} name={'email'} label={'Email'} value={session.user.email ?? ''} />}
          </div>
          <Input type={'text'} name={'title'} label={'Title'} required />
          <Input type={'url'} name={'youtubeLink'} label={'Youtube Link'} /> 
          <Input type={'text'} name={'ingredients'} label={'Ingredients'} required /> 
          <div className={classes.row}>
            <Input type={'text'} name={'totalCost'} label={'Total Cost'} />  
            <Input type={'text'} name={'totalTime'} label={'Total Time'} />  
          </div>
          {/* <Input type={'text'} name={'instructions'} label={'Instructions'} />   */}

          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={10}
              required
            ></textarea>
          </p>
          <ImagePicker label='Your image' name='image'/>
          <p className={classes.actions}>
            <SubmitButton text={'Share recipe'}/>
          </p>
        </form>
      </main>
    </>
  );
}