import MealItem from './meal-item';
import classes from './meals-grid.module.css';

export default function MealsGrid({ recipes }){
    return(
        <ul className={classes.meals}>
            {recipes.map(recipe => 
            <li key={recipe.id}>
                <MealItem {...recipe} />
            </li>)}
        </ul>
    )
}