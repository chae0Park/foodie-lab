'use client';

import classes from './post-form.module.css';
import ImagePicker from '@/components/meals/image-picker';
import { useSession } from "next-auth/react";
import SubmitButton from '@/components/submit-button'
import { usePathname } from 'next/navigation';
import { notFound } from 'next/navigation';



export default function PostForm({}) {
    const { data: session, status } = useSession();
    const path = usePathname();

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
    
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form); 

        const formDataObj :Record<string, any> ={};
        formData.forEach((value, key) => {
          formDataObj [key] = value;
        });
    
        console.log("formData 객체", formDataObj);
    
        //이미지 파일을 바이너리 (01010100)에서 문자형태로 변환한다 = base64
        const image = formDataObj.image as File;
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {
        const result  = reader.result;
        let imageBase64 = '';
        if(typeof result === 'string'){
          imageBase64 = result.split(',')[1]; // base64 문자열만 추출
        }
    
          const response = await fetch('/api/community', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,  // JWT 토큰을 헤더에 포함시켜 전송
              'Content-Type' : 'application/json', //데이터는 multipart/formData 가 아닌 json형식으로 전송
            },
            body: JSON.stringify({
              ...formDataObj,
              imageBase64,
              path // for categorising the post
            }),  // FormData를 요청의 body로 전달
          });
          if (response.ok) {
            // 성공 시 리디렉션
            if(path.includes('nearbuy')){
            window.location.href = '/community/nearbuy'; 
            }else if(path.includes('events')){
              window.location.href = '/community/events'; 
            } 
          } else {
            // 오류 처리
            console.error('폼 제출 실패');
          }
        };
      };

    return (
      <>
        <header className={classes.header}>
            <h1>
              {path.startsWith('/community')
                ? path.includes('nearbuy')
                  ? <>Share or sell your  <span className={classes.highlight}>extra ingredients or kitchenwares</span></>
                  : <>Create an <span className={classes.highlight}>event for you and members</span></>
                : null }
            </h1>
        </header>
        <main className={classes.main}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <ImagePicker label='Your image' name='image' />
              <div className={classes.row}>
                  <p>
                      <label htmlFor="name">Your name</label>
                      {session && session.user &&
                          <input type="email" id="email" name="email" value={session.user.name ?? ''} required disabled />}
                  </p>
                  <p>
                      <label htmlFor="email">Your email</label>
                      {session && session.user &&
                          <input type="email" id="email" name="email" value={session.user.email ?? ''} required disabled />}
                  </p>
              </div>
              <p>
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" name="title" required />
              </p>
              <p>
                {path.includes('nearbuy') ?
                  <>
                    <label htmlFor="summary">Price</label>
                    <input type="text" id="summary" name="summary" required placeholder='$'/>
                  </> :
                  <>
                    <label htmlFor="summary">Address</label>
                    <input type="text" id="summary" name="summary" required />

                  </>}
              </p>
              <p>
                  <label htmlFor="instructions">Instructions</label>
                  <textarea
                      id="instructions"
                      name="instructions"
                      rows={10}
                      required
                  ></textarea>
              </p>
              
              <p className={classes.actions}>
                  <SubmitButton text={'Share recipe'} />
              </p>
          </form>
        </main>
      </>
    )
}