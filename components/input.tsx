'use client';

import { JSX } from "react";

interface InputProps {
    type: string;
    name: string;
    label: string;
    value?: string;
    required?: boolean;
    fn?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export default function Input({type, name, label, value, required, fn = () => {}, disabled = false}: InputProps): JSX.Element {
    return (
        <p>
            <label htmlFor={name}>{label}</label>
            <input 
                type={type} 
                id={name} 
                name={name} 
                value ={value}
                onChange={fn}
                required={required}  
                disabled={disabled}    
            />
        </p>
    )
}