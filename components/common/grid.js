import ItemCard from './item-card.js';
import classes from './grid.module.css';

export default function Grid({ data }){
    return(
        <ul className={classes.dataGrid}>
            {data.map(datum => 
            <li key={datum.id}>
                <ItemCard {...datum} />
            </li>)}
        </ul>
    )
}