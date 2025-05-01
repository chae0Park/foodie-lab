'use client';

import Link from "next/link";
import classes from './nav-link.module.css';
import { usePathname } from "next/navigation";
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  fn?: () => void;
}

export default function NavLink({ href, children, fn }: NavLinkProps) {
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


