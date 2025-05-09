// community/events/[slug]/page.js
import classes from './page.module.css';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CheckSession from '@/components/CheckSession';
import Link from 'next/link';
import DeleteButton from '@/components/common/DeleteButton';
import { getEvent } from '@/lib/event';
import { Event } from '@prisma/client';

// 동적으로 메타데이터 설정- data fetching code 
export async function generateMetadata({ params }: { params: { eventSlug: string } }) {
    const data: Event = await getEvent(params.eventSlug);  // await 추가
    if (!data) {
        return {
            title: 'Data Not Found',
            description: 'The data you are looking for was not found.',
        };
    }
    return {
        title: data.title,
        description: data.instructions,
    };
}

export default async function EventsDetailPage({ params }: { params: { eventSlug: string } }) {
    const event = await getEvent(params.eventSlug);

    if (!event) {
        notFound();
    }

    event.instructions = event.instructions.replace(/\n/g, '<br />');

    return(
        <>
        <header className={classes.header}>
            <div className={classes.headerText}>
                <h1>{event.title}</h1>
                <div className={classes.subInfo}>
                    <p className={classes.summary}>{event.summary}</p>
                    <p className={classes.creator}>
                        added by <a href={`mailto: ${event.author.email}`}>{event.author.name}</a>
                    </p>
                </div>
                <CheckSession>
                    <div className={classes.editDelete}>
                        <Link href={`/community/events/${event.slug}/edit`}>edit</Link>
                        <DeleteButton slug={event.slug} />
                    </div>
                </CheckSession>
            </div>
        </header>
        <div className={classes.image}>
            <Image src={event.images} alt={event.title} fill/>
        </div>
        <main >
            <div className={classes.row}>
                <p className={classes.time}>Event Start Time: {event.time}</p>
                <p className={classes.estimatedTime}>Event Duration Time: {event.estimatedTime}</p>
                <p className={classes.address}>Event Venue Address: {event.address}</p>
                <p className={classes.fee}>Event Fee: {event.fee}</p>
            </div>
            <p
                className={classes.instructions}
                dangerouslySetInnerHTML={{
                    __html: event.instructions,
                }}
            >
            </p>
        </main>
        </>
    )

}