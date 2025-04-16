// app/community/events/[eventSlug]/edit/page.js
import classes from './page.module.css';
import { getItem } from '@/lib/item';
import { notFound } from 'next/navigation';
import EditForm from '@/components/common/edit-input';

export default async function EventEditPage({ params }) {
  const event = await getItem(params.eventSlug);
  const eventSlug = params.eventSlug;

    if(!event){
        notFound();
    }

  return (
    <>
      <header className={classes.header}>
        <h1>Edit your <span className={classes.highlight}>event</span></h1>
      </header>
      <main className={classes.main}>
        <EditForm data={event} params={eventSlug}/>
      </main>
    </>
  );
}



