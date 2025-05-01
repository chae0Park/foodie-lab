// app/meals/[mealSlug]/edit/page.js
import classes from '../../share/page.module.css';
import { getRecipe } from '@/lib/recipe';
import { notFound } from 'next/navigation';
import EditForm from './edit-input';

export default async function EditMealPage({ params }: { params: { mealSlug: string } }) {
  const recipe = await getRecipe(params.mealSlug);

    if(!recipe){
        notFound();
    }

  return (
    <>
      <header className={classes.header}>
        <h1>Edit your <span className={classes.highlight}>recipe</span></h1>
      </header>
      <main className={classes.main}>
        <EditForm recipe={recipe} />
      </main>
    </>
  );
}


