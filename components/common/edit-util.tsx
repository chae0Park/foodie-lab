// 타입 정의
export interface FormDataObj {
    [key: string]: FormDataEntryValue;
  }
  
  // 공통 handleSubmit 함수
  export const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    sendRequestFn: (formDataObj: FormDataObj, imageBase64?: string) => Promise<void>,
    extraData?: Record<string, any> // 예: slug 등 추가로 주입할 데이터
  ) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataObj: FormDataObj = {};
  
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
  
    // 추가 데이터 주입
    if (extraData) {
      Object.assign(formDataObj, extraData);
    }
  
    const image = formData.get("image");
    if (image instanceof File && image.size > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const result = reader.result;
        const base64 = typeof result === "string" ? result.split(",")[1] : undefined;
        await sendRequestFn(formDataObj, base64);
      };
    } else {
      await sendRequestFn(formDataObj);
    }
  };
  
  // 공통 API 요청 함수
  export const sendUpdateRequest = async (
    formDataObj: FormDataObj,
    accessToken: string,
    apiPath: string,          // 예: `/api/recipe/${slug}`
    redirectPath?: string,    // 예: `/meals/${slug}`
    imageBase64?: string
  ): Promise<void> => {
    const requestBody: any = { ...formDataObj };
  
    if (imageBase64) {
      requestBody.imageBase64 = imageBase64;
    }
  
    const response = await fetch(apiPath, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  
    if (response.ok) {
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    } else {
      console.error('폼 제출 실패');
    }
  };
  