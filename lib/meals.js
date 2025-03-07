import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals(){
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // throw new Error('Loading meals failed');
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug){ //특정 데이터 패칭
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal){ //데이터를 update할 때 slug라는 항목이 있는데 form에서는 slug값을 받아올 수 없다
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if(error){
            throw new Error('Saving image failed!');
        }
    });

    meal.image = `/images/${fileName}`;

    db.prepare(`
         INSERT INTO meals
         (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )    
    `).run(meal);
}