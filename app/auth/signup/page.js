import classes from './page.module.css'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'

export default function SignUp() {
    return (
        <div>
            <header className={classes.header}>
                <h1>
                    Sign up today and <span className={classes.highlight}>enjoy members' perks</span>
                </h1>
            </header>
            <main className={classes.main}>
                <form className={classes.form}>
                    <Input type={'email'} name={'email'} label={'Your email'} />
                    <Input type={'password'} name={'password'} label={'Your password'} />
                    <Input type={'text'} name={'name'} label={'Your name'} />

                    {/* <ImagePicker label='Your image' name='image' />
                    {state.message && <p>{state.message}</p>} */}
                    <p className={classes.actions}>
                        <SubmitButton text={'Sign up'} />
                    </p>
                </form>
            </main>
        </div>
    )
}
