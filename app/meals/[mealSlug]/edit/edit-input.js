// app/meals/[mealSlug]/edit/edit-input.js

'use client';
import { useState } from 'react';
import ImagePicker from '@/components/meals/image-picker';
import SubmitButton from '@/components/submit-button';
import classes from '../../share/page.module.css';
import { useSession } from "next-auth/react";



export function Input({type, name, label, value, disabled = false}) {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);  // 상태 업데이트
    };

    return(
        <p>
            <label htmlFor={name}>{label}</label>
            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={inputValue}
                    onChange={handleChange}
                    required
                    disabled={disabled}
                    rows="5" // 원하는 크기 설정
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={inputValue}
                    onChange={handleChange}
                    required
                    disabled={disabled}
                />
            )}
        </p>
    );
}


export default function EditForm({recipe}) {
    const { data: session } = useSession();
    const params = { mealSlug: recipe.slug };

    const handleSubmit = async (e) => {
        e.preventDefault();  // 기본 폼 제출 동작 방지

        // 폼 데이터를 FormData 객체로 가져옴
        const formData = new FormData(e.target);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        formDataObj.slug = params.mealSlug;

        //새로 선택된 이미지 처리
        if (formDataObj.image && formDataObj.image.size > 0) {
            const image = formDataObj.image;
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                const newImageBase64 = reader.result.split(',')[1];

                // 새 이미지를 전송할 때는 `newImageBase64`를 사용
                await sendUpdateRequest(formDataObj, newImageBase64);
            };
            
        } else {
            await sendUpdateRequest(formDataObj);
            //await sendUpdateRequest(formDataObj, recipe.images);
        }
    };

    // 서버로 데이터를 전송하는 함수
    const sendUpdateRequest = async (formDataObj, imageBase64) => {
        const accessToken = session.user.accessToken;
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
            <Input type={'text'} name={'summary'} label={'summary'} value={recipe.summary} />
            <Input
                name={"instructions"}
                rows="10"
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


