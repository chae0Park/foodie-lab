'use client';
export default function Input({type, name, label, value, fn = () => {} }){
    return(
        <p>
            <label htmlFor={name}>{label}</label>
            <input 
                type={type} 
                id={name} 
                name={name} 
                value={value}
                onChange={fn}
                required  />
        </p>
    )
}