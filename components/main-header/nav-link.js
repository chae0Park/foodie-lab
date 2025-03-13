'use client';

import Link from "next/link";
import classes from './nav-link.module.css';
import { usePathname } from "next/navigation";

export default function NavLink({href, children, fn}){ //children 은 Link 태그 안에 들어가는 내용 즉 여기서는 Browse Meal에 해당한다.
    const path = usePathname();

    return(
        <Link 
            href={href}
            className={path.startsWith(href) ? `${classes.link} ${classes.active}` : classes.link }
            onClick={fn}
        >
            {children}
        </Link>

    )
}