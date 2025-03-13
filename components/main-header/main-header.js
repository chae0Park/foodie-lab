import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";
import CommunityLink from "./community-drop-down";
import logoImg from '@/assets/logo.png';
import classes from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";

export default function MainHeader() {
    return (
        <>
            <MainHeaderBackground />
            <header className={classes.header}>
                <Link className={classes.logo} href='/'>
                    <Image src={logoImg} alt='A plate with food on it' priority />
                    NextLevel Food
                </Link>

                <nav className={classes.nav}>
                    <ul>
                        <li>
                            <NavLink href='/auth/signin'>Log in</NavLink>
                        </li>
                        <li>
                            <NavLink href='/meals'>Browse Meal</NavLink>
                        </li>
                        <CommunityLink />
                    </ul>                    
                </nav>
            </header>
        </>

    );
}