export default function Input({type, name, label}){
    return(
        <p>
            <label htmlFor={name}>{label}</label>
            <input type={type} id={name} name={name} required />
        </p>
    )
}