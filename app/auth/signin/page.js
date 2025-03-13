import classes from './page.module.css'
import Link from 'next/link'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'

export default function SignIn() {
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
                <form className={classes.form}>
                    <Input type={'email'} name={'email'} label={'Your email'} />
                    <Input type={'password'} name={'password'} label={'Your password'} />
                    <p className={classes.actions}>
                        <SubmitButton text={'Sign in'}/>
                    </p>
                </form>
            </main>

        </div>
    )
}
