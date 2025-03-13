'use client'
//import Link from "next/link";
import NavLink from "./nav-link";
import { usePathname } from "next/navigation";
import classes from './community-drop-down.module.css'

export default function CommunityLink() {
    const path = usePathname();

    return (
        <ul className={classes.ul}>
            <li className={classes.li}>
                <NavLink href='/community'>Foodies Community</NavLink>
                {path.startsWith('/community') && (
                    <ul className={classes.dropdownMenu}>
                        <li><NavLink href='/community/nearbuy'>Near Buy</NavLink></li>
                        <li><NavLink href='/community/events'>Events</NavLink></li>
                    </ul>
                )}
            </li>
        </ul>
    )
}