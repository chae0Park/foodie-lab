'use client'
import classes from './page.module.css'
import Link from 'next/link'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { useFormState } from 'react-dom';
import { validateLogin } from '@/lib/action';

export default function SignIn() {
    const [ state, formAction ] = useFormState(validateLogin, {message: null});
    
    return(
        <div>
            <header className={classes.header}>
                <h1>
                Haven't signed up yet? &nbsp;
                    <span ></span>
                </h1>
               
                <p className={classes.cta}>
                    <Link href='/auth/signup'>
                        Join Here
                    </Link>
                </p>
            </header>
            <main className={classes.main}>
                <form className={classes.form} method='POST' action={formAction}>
                    <Input type={'email'} name={'email'} label={'Your email'} />
                    <Input type={'password'} name={'password'} label={'Your password'} />
                    {state.message && <p>{state.message}</p>}
                    <p className={classes.actions}>
                        <SubmitButton text={'Sign in'}/>
                    </p>
                </form>
            </main>

        </div>
    )
}
