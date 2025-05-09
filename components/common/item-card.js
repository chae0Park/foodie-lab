'use client'
import Link from 'next/link';
import Image from 'next/image';
import classes from './item-card.module.css';
import { usePathname } from "next/navigation";


export default function ItemCard({ title, slug, images, summary, price, author }) {  
    const path = usePathname();

    return (
    <article className={classes.item}>
      <header>
        <div className={classes.image}>
          <Image src={images} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>added by {author.name}</p>
        </div>
      </header>
      <div className={classes.content}>
        {path.includes('/nearbuy') 
          ? <p className={classes.summary}>$ &nbsp;{price}</p>
          : <p className={classes.summary}>{summary}</p>
        }
        <div className={classes.actions}>
        {path.startsWith('/meals') 
            ? <Link href={`/meals/${slug}`} >View Details</Link>
            : path.startsWith('/community') 
            ? path.includes('/nearbuy') 
                ? <Link href={`/community/nearbuy/${slug}`}>View Details</Link>
                : <Link href={`/community/events/${slug}`}>View Details</Link>
            : null
        }
        </div>
      </div>
    </article>
  );
}
