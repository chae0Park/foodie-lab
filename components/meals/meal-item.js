import Link from 'next/link';
import Image from 'next/image';
import classes from './meal-item.module.css';

export default function MealItem({ title, slug, images, summary, author }) {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={images} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {author.name}</p>
        </div>
      </header>
      <div className={classes.content}>
        {/* <p className={classes.summary}>{summary}</p> */}
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  );
}