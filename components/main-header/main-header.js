'use client'
import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";
import CommunityLink from "./community-drop-down";
import logoImg from '@/assets/logo.png';
import classes from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";
import {useSession} from "next-auth/react";
import { signOut } from 'next-auth/react'

export default function MainHeader() {
    const { data: session } = useSession();

    const handleLogout = () => {
        signOut();
      };

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
                        {(session && session.user) ? (
                            <li>
                                <button onClick={handleLogout}>Log out</button>
                            </li>
                        )
                            : (
                                <li>
                                    <NavLink href='/auth/signin'>Log in</NavLink>
                                </li>)
                        }
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