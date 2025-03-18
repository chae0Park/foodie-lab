import classes from './page.module.css';
import { getRecipe } from '@/lib/recipe';
import { notFound } from 'next/navigation';
import Image from 'next/image';


// 동적으로 메타데이터 설정
export async function generateMetadata({ params }) {
    const recipe = await getRecipe(params.mealSlug);  // await 추가
    if (!recipe) {
        return {
            title: 'Recipe Not Found',
            description: 'The recipe you are looking for was not found.',
        };
    }
    return {
        title: recipe.title,
        description: recipe.summary,
    };
}

export default async function MealDetailPage({ params }){
    const recipe = await getRecipe(params.mealSlug);

    if(!recipe){
        notFound();
    }

    recipe.instructions = recipe.instructions.replace(/\n/g, '<br />');

    return<>
        <header className={classes.header}>
            <div className={classes.image}>
                <Image src={recipe.images} alt={recipe.title} fill />
            </div>
            <div className={classes.headerText}>
                <h1>{recipe.title}</h1>
                <p className={classes.creator}>
                    by <a href={`mailto: ${recipe.author.email}`}>{recipe.author.name}</a>
                </p>
                <p className={classes.summary}>{recipe.summary}</p>
            </div>
        </header>
        <main >
            <p
                className={classes.instructions}
                dangerouslySetInnerHTML={{
                    __html: recipe.instructions,
                }}
            >

            </p>
        </main>
    </>
}