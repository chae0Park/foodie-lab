'use client';

import classes from './page.module.css';
import ImagePicker from '@/components/meals/image-picker';
import { useSession } from "next-auth/react";
import SubmitButton from '@/components/submit-button'

export default function ShareMealPage() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();  // 기본 폼 제출 동작 방지
  
    //accessToken을 가져와야하는데 session에 저장해 두었음 
    const accessToken = session.user.accessToken;
    if(!accessToken){
      console.error('No accessToken');
    }else{
      console.log('accessToken 값은?', accessToken);
    }

    // 폼 데이터를 FormData 객체로 가져옴
    const formData = new FormData(e.target);  // e.target은 현재 폼을 가리킴
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    console.log("formData 객체", formDataObj);

    //이미지 파일을 바이너리 (01010100)에서 문자형태로 변환한다 = base64
    const image = formDataObj.image;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      const imageBase64 = reader.result.split(',')[1]; //extracting string

          // fetch로 폼 데이터를 전송
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // JWT 토큰을 헤더에 포함시켜 전송
          'Content-Type' : 'application/json', //데이터는 multipart/formData 가 아닌 json형식으로 전송
        },
        body: JSON.stringify({
          ...formDataObj,
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
  };

  //todo: get 으로 데이터 펫칭하기 

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
            <p>
              <label htmlFor="name">Your name</label>
              {session && session.user && 
              <input type="email" id="email" name="email" value={session.user.name} required disabled />}
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              {session && session.user && 
              <input type="email" id="email" name="email" value={session.user.email} required disabled />}
            </p>  
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Ingredients</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
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