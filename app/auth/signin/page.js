'use client'
import classes from './page.module.css'
import Link from 'next/link'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        // NextAuth 로그인 요청
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false, // 로그인 후 리디렉션 방지
        })

        if (res?.error) {
            setError('Invalid email or password')
        } else {
            // 로그인 성공 시 리디렉션
            window.location.href = '/' // 홈으로 리디렉션
        }
    }

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
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Input type={'email'} name={'email'} label={'Your email'} value={email} fn={(e) => setEmail(e.target.value)}/>
                    <Input type={'password'} name={'password'} label={'Your password'} value={password}  fn={(e) => setPassword(e.target.value)}/>
                    {error && <p>{error}</p>}
                    <p className={classes.actions}>
                        <SubmitButton text={'Sign in'}/>
                    </p>
                </form>
            </main>

        </div>
    )
}
