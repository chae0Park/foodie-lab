import classes from '../../share/page.module.css';
import { getRecipe } from '@/lib/recipe';
import { notFound } from 'next/navigation';
import ImagePicker from '@/components/meals/image-picker';
import SubmitButton from '@/components/submit-button';
import Input from '@/components/input'

export default async function EditMealPage({ params }) {
  const recipe = await getRecipe(params.mealSlug);

    if(!recipe){
        notFound();
    }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();  // 기본 폼 제출 동작 방지
  
  //   const accessToken = session.user.accessToken;
  //   if (!accessToken) {
  //     console.error('No accessToken');
  //     return;
  //   }

  //   // 폼 데이터를 FormData 객체로 가져옴
  //   const formData = new FormData(e.target);
  //   const formDataObj = {};
  //   formData.forEach((value, key) => {
  //     formDataObj[key] = value;
  //   });

  //   // 이미지 파일을 base64로 변환
  //   const image = formDataObj.image;
  //   const reader = new FileReader();
  //   reader.readAsDataURL(image);
  //   reader.onload = async () => {
  //     const imageBase64 = reader.result.split(',')[1];

  //     // fetch로 폼 데이터를 전송 (PUT 요청)
  //     const response = await fetch(`/api/user/recipe/${params.mealSlug}`, {
  //       method: 'PUT',  // 기존 데이터를 수정하는 PUT 요청
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ...formDataObj,
  //         imageBase64,
  //       }),
  //     });

  //     if (response.ok) {
  //       window.location.href = `/meals/${params.mealSlug}`;  // 수정 완료 후 해당 페이지로 리디렉션
  //     } else {
  //       console.error('폼 제출 실패');
  //     }
  //   };
  // };

  return (
    <>
      <header className={classes.header}>
        <h1>Edit your <span className={classes.highlight}>recipe</span></h1>
      </header>
      <main className={classes.main}>
        <form className={classes.form}>
          {/* onSubmit={handleSubmit} */}
          <div className={classes.row}>
              <Input type={'text'} name={'name'} label={'Your name'} value={recipe.author.name} labelClassName={'inputLabel'} inputClassName={'inputTag'} disabled/>
              <Input type={'email'} name={'email'} label={'Your email'} value={recipe.author.email} labelClassName={'inputLabel'} inputClassName={'inputTag'} disabled/>
          </div>
          <Input type={'text'} name={'title'} label={'title'} value={recipe.title} labelClassName={'inputLabel'} inputClassName={'inputTag'}/>
          <Input type={'text'} name={'summary'} label={'summary'} value={recipe.summary} labelClassName={'inputLabel'} inputClassName={'inputTag'}/>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
              value={recipe.instructions}
            ></textarea>
          </p>
          <ImagePicker label="Your image" name="image" editImg={recipe.images} />
          <p className={classes.actions}>
            <SubmitButton text={"Update recipe"} />
          </p>
        </form>
      </main>
    </>
  );
}
