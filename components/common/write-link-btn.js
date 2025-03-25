import CheckSession from '@/components/CheckSession';
import Link from 'next/link';
import classes from './write-link-btn.module.css';

export default function WriteLinkBtn({href, children}){
    return(
        <CheckSession>
        <p className={classes.cta}>
            <Link href={href}>
                {children}
            </Link>
        </p>
        </CheckSession>
    )
}