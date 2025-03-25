import WriteLinkBtn from '@/components/common/write-link-btn';
import classes from './page.module.css';
import CheckAccessToken from '@/components/check-accessToken';

export default function Events() {
    
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
                <WriteLinkBtn href={'/community/events/post'}>add an event</WriteLinkBtn>
            </header>
            <main className={classes.main}>
                {/* <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
                    <Meals />
                </Suspense> */}
            </main>
        </CheckAccessToken>
    )
}