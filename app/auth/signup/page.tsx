'use client';
//app/auth/signup/page.js
import classes from './page.module.css'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { useActionState } from "react";
import { validateUser } from '@/lib/action';

type Message = {
    message: string | null;
}

export default function SignUp() {
    const [state, formAction] = useActionState<Message, FormData>(validateUser, {message: null});
    
    return (
        <div>
            <header className={classes.header}>
                <h1>
                    Sign up today and <span className={classes.highlight}>enjoy members' perks</span>
                </h1>
            </header>
            <main className={classes.main}>
                <form className={classes.form} action={formAction}>
                    <Input type={'email'} name={'email'} label={'Your email'} />
                    <Input type={'password'} name={'password'} label={'Your password'} />
                    <Input type={'text'} name={'name'} label={'Your name'} />
                    {state.message && <p>{state.message}</p>}
                    {/* <ImagePicker label='Your image' name='image' /> */}
                    <p className={classes.actions}>
                        <SubmitButton text={'Sign up'} />
                    </p>
                </form>
            </main>
        </div>
    )
}