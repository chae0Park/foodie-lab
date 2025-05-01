import MealsGrid from '@/components/meals/meals-grid';
import Link from 'next/link';
import classes from './page.module.css';
import { getRecipes } from '@/lib/recipe';
import { Suspense } from 'react';
import CheckSession from '@/components/CheckSession';

async function Meals(){
    const recipes = await getRecipes(); 
    return <MealsGrid recipes={recipes} />
}

export default function MealsPage(){
    
    return(
        <>
            <header className={classes.header}>
                <h1>
                    Delicious meals, created{''}
                    <span className={classes.highlight}>by you</span>
                </h1>
                <p>
                    Choose your favourite recipe and cook it yourself. 
                    It is easy and fun!
                </p>
                <CheckSession>
                    <p className={classes.cta}>
                        <Link href='/meals/share'>
                            Share your Recipes
                        </Link>
                    </p>
                </CheckSession>
            </header>
            <main className={classes.main}>
                <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}> 
                    <Meals/>
                </Suspense>
            </main>
        </>
    )
        
   
}