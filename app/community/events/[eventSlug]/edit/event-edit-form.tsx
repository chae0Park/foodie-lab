
'use client';
import ImagePicker from '@/components/meals/image-picker';
import SubmitButton from '@/components/submit-button';
import classes from '@/app/meals/share/page.module.css';
import { useSession } from 'next-auth/react';
import Input from '@/components/common/Input'; 
import { Event } from '@prisma/client';
import React from 'react';

interface EventType extends Event {
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



export default function EditForm({data}: {data: EventType}) {
    const { data: session } = useSession();
    const params = { eventSlug: data.slug };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();  // 기본 폼 제출 동작 방지

        // 폼 데이터를 FormData 객체로 가져옴
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataObj:FormDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        formDataObj.slug = params.eventSlug;

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

        const response = await fetch(`/api/community/event/${params.eventSlug}`, {
            method: 'PUT',  // 기존 데이터를 수정하는 PUT 요청
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            window.location.href = `/community/events/${params.eventSlug}`;  // 수정 완료 후 해당 페이지로 리디렉션

        } else {
            console.error('폼 제출 실패');
        }
    };    


    return (
        <form className={classes.form} onSubmit={handleSubmit} >
            <div className={classes.row}>
              <Input type={'text'} name={'name'} label={'Your name'} value={data.author.name} disabled />
              <Input type={'email'} name={'email'} label={'Your email'} value={data.author.email} disabled />
            </div>

            <Input type={'text'} name={'title'} label={'title'} value={data.title} />
            <div className={classes.row}>
                <Input type={'text'} name={'time'} label={'Time'} value={data.time} />
                <Input type={'text'} name={'estimatedTime'} label={'Estimated time'} value={data.estimatedTime ?? ''} />
                <Input type={'text'} name={'address'} label={'Address'} value={data.address} />
                <Input type={'text'} name={'fee'} label={'Fee'} value={data.fee} />
            </div>
            <Input
                name={"instructions"}
                // rows
                required
                value={data.instructions}
                type={'textarea'}
                label={'Instructions'}
            />
            <ImagePicker label="Your image" name="image" editImg={data.images} />
            <p className={classes.actions}>
                <SubmitButton text={"Update data"} />
            </p>
        </form>
    )
}


