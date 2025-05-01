'use client';
import React, { useState, JSX } from 'react';

interface InputProps {
    type: string;
    name: string;
    label: string;
    value?: string;
    required?: boolean;
    fn?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    isTextarea?: boolean;
}


export default function Input({type, name, label, value='', required = false, disabled = false, fn = () => {}, placeholder='', isTextarea = false}: InputProps): JSX.Element { 
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);  // 상태 업데이트
        fn(e);
    };

    return(
        <p>
            <label htmlFor={name}>{label}</label>
            {isTextarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={inputValue ?? ''}
                    onChange={handleChange}
                    required
                    disabled={disabled}
                    rows={10} // 원하는 크기 설정
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={inputValue}
                    onChange={handleChange}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                />
            )}
        </p>
    );
}