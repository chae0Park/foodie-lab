// app/community/nearbuy/[itemSlug]/edit/page.js
import classes from './page.module.css';
import { getItem } from '@/lib/item';
import { notFound } from 'next/navigation';
import EditForm from '@/components/common/edit-input';

export default async function NearbuyEditPage({ params }) {
  const item = await getItem(params.itemSlug);
  const itemSlug = params.itemSlug;

  console.log('itemSlug',itemSlug);
    if(!item){
        notFound();
    }

  return (
    <>
      <header className={classes.header}>
        <h1>Edit your <span className={classes.highlight}>item</span></h1>
      </header>
      <main className={classes.main}>
        <EditForm data={item} params={itemSlug}/>
      </main>
    </>
  );
}



