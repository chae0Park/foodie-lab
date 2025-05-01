// app/community/events/[eventSlug]/edit/page.js
import classes from './page.module.css';
import { getEvent } from '@/lib/event';
import { notFound } from 'next/navigation';
import EditForm from './event-edit-form';

export default async function EventEditPage({ params }: { params: { eventSlug: string } }) {
  const event  = await getEvent(params.eventSlug);

    if(!event){
        notFound();
    }

  return (
    <>
      <header className={classes.header}>
        <h1>Edit your <span className={classes.highlight}>event</span></h1>
      </header>
      <main className={classes.main}>
        <EditForm data={event}/>
      </main>
    </>
  );
}



