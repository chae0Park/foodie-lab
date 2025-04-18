"use client"

import { useRef, useState } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';

export default function ImagePicker({ label, name, editImg }){
    const [pickedImage, setPickedImage] = useState();
    const imageInput = useRef();

    function handlePickClick(){
        imageInput.current.click();
    }

    function handleImageChange(event){
        const file = event.target.files[0];

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
                    {!pickedImage && !editImg
                        ? <p>No image is picked yet.</p>
                        :  <Image 
                            src={pickedImage ? pickedImage : editImg}
                            alt='The image selected by the user.'
                            fill
                         />
                    }
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