// app/meals/[mealSlug]/edit/page.js
import classes from '../../share/page.module.css';
import { getRecipe } from '@/lib/recipe';
import { notFound } from 'next/navigation';
import EditForm from './edit-input';

export default async function EditMealPage({ params }) {
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



{/* <form className={classes.form}>
           onSubmit={handleSubmit} 
          <div className={classes.row}>
              <Input type={'text'} name={'name'} label={'Your name'} value={recipe.author.name} disabled/>
              <Input type={'email'} name={'email'} label={'Your email'} value={recipe.author.email} disabled/>
          </div>
          <Input type={'text'} name={'title'} label={'title'} value={recipe.title}/>
          <Input type={'text'} name={'summary'} label={'summary'} value={recipe.summary}/>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
              value={recipe.instructions}
            ></textarea>
          </p>
          <ImagePicker label="Your image" name="image" editImg={recipe.images} />
          <p className={classes.actions}>
            <SubmitButton text={"Update recipe"} />
          </p>
        </form> */}