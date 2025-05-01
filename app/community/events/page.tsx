import WriteLinkBtn from '@/components/common/write-link-btn';
import classes from './page.module.css';
import CheckAccessToken from '@/components/check-accessToken';
import Grid from '@/components/common/grid';
import { getEvents } from '@/lib/event';
import { Suspense } from 'react';

async function Events() {
    const events = await getEvents(); 
    return <Grid data={events} />
}

export default function EventsPage() {
    
    return (
        <CheckAccessToken>
            <header className={classes.header}>
                <h1>
                    Every week, a new event is waiting for you!
                </h1>
                <p>
                    Participate in exclusive  <span className={classes.highlight}>events</span> And
                    Find <span className={classes.highlight}>new friends & like-minded people</span>
                </p>
                <WriteLinkBtn href={'/community/events/post'}>Add event</WriteLinkBtn>
            </header>
            <main className={classes.main}>
                <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
                    <Events />
                </Suspense>
            </main>
        </CheckAccessToken>
    )
}