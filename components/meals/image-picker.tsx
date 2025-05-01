"use client"

import { JSX, useRef, useState } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';

interface ImagePickerProps {
    label: string;
    name: string;
    editImg?: { id: number; url: string }[];
}

export default function ImagePicker({ label, name, editImg }: ImagePickerProps): JSX.Element {
    const [pickedImage, setPickedImage] = useState<String | ArrayBuffer | null>(null);
    const imageInput = useRef<HTMLInputElement>(null);

    function handlePickClick(): void{
        imageInput.current?.click();
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void{
        const file = event.target.files?.[0];

        if(!file){
            setPickedImage(null);
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPickedImage(fileReader.result);
        };

        fileReader.readAsDataURL(file); // 읽긴 하는데 readAsDataURL()는 return 없는 void 함수임 

    }

    return(
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {/* {!pickedImage && !editImg
                        ? <p>No image is picked yet.</p>
                        :  <Image 
                            src={typeof pickedImage === 'string' ? pickedImage : editImg?.[0].url ?? ''}
                            alt='The image selected by the user.'
                            fill
                         />
                    } */}
                    {pickedImage ? (
                    <Image 
                    src={pickedImage as string}
                    alt='The image selected by the user.'
                    fill
                    />
                ) : editImg?.[0]?.url ? (
                    <Image 
                    src={editImg[0].url}
                    alt='Previously uploaded image.'
                    fill
                    />
                ) : (
                    <p>No image is picked yet.</p>
                )}
                </div>
                <input
                    className={classes.input} 
                    type='file'
                    id={name}
                    accept='image/png, image/jpeg'
                    name={name}
                    ref={imageInput}
                    //multiple
                    onChange={handleImageChange}
                    //required
                />
                <button
                    className={classes.button}
                    type='button'
                    onClick={handlePickClick}
                >
                    Pick an Image
                </button>
            </div>
        </div>
    )
}