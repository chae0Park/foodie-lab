// app/meals/[mealSlug]/edit/edit-input.js
'use client';
import React from 'react';
import ImagePicker from '@/components/meals/image-picker';
import SubmitButton from '@/components/submit-button';
import classes from '../../share/page.module.css';
import { useSession } from "next-auth/react";
import Input from '@/components/common/Input';

interface Recipe {
    title: string;
    instructions: string;
    imageBase64: string;
    youtubeLink?: string;
    ingredients: string;
    totalCost?: string;
    totalTime?: string;
    slug: string;  

    author: {
        id: number;
        name: string;
        email: string;
      };
    
    images: {
    id: number;
    url: string;
    }[];
}

type FormDataObj = {
    [key: string]: FormDataEntryValue;
};



export default function EditForm({recipe}: {recipe: Recipe}) {
    const { data: session } = useSession();
    const params = { mealSlug: recipe.slug };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  // 기본 폼 제출 동작 방지

        // 폼 데이터를 FormData 객체로 가져옴
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataObj:FormDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        formDataObj.slug = params.mealSlug;

        //새로 선택된 이미지 처리
        if (formDataObj.image instanceof File && formDataObj.image.size > 0) {
            const image = formDataObj.image;
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                const result = reader.result;
                let newImageBase64;
                if (typeof result === 'string') {
                    newImageBase64 = result.split(',')[1];  // base64 문자열에서 데이터 부분만 추출
                }
                await sendUpdateRequest(formDataObj, newImageBase64);
            };
        } else {
            await sendUpdateRequest(formDataObj);
        }
    };

    // 서버로 데이터를 전송하는 함수
    const sendUpdateRequest = async (formDataObj:FormDataObj, imageBase64?: string | null | undefined): Promise<void> => {
        const accessToken = session?.user.accessToken;
        if(!accessToken){
          console.error('No accessToken');
        }else{
          console.log('accessToken 값은?', accessToken);
        }

        const requestBody = {
            ...formDataObj,
        };

        // imageBase64가 있다면 추가
        if (imageBase64) {
            requestBody.imageBase64 = imageBase64;
        }

        const response = await fetch(`/api/recipe/${params.mealSlug}`, {
            method: 'PUT',  // 기존 데이터를 수정하는 PUT 요청
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            window.location.href = `/meals/${params.mealSlug}`;  // 수정 완료 후 해당 페이지로 리디렉션

        } else {
            console.error('폼 제출 실패');
        }
    };


    return (
        <form className={classes.form} onSubmit={handleSubmit} >
            <div className={classes.row}>
                <Input type={'text'} name={'name'} label={'Your name'} value={recipe.author.name} disabled />
                <Input type={'email'} name={'email'} label={'Your email'} value={recipe.author.email} disabled />
            </div>
            <Input type={'text'} name={'title'} label={'title'} value={recipe.title} />
            <Input type={'text'} name={'ingredients'} label={'ingredients'} value={recipe.ingredients} />
            <Input
                name={"instructions"}
                required
                value={recipe.instructions}
                type={'textarea'}
                label={'Instructions'}
            />
            <ImagePicker label="Your image" name="image" editImg={recipe.images} />
            <p className={classes.actions}>
                <SubmitButton text={"Update recipe"} />
            </p>
        </form>
    )
}


