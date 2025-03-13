import classes from './page.module.css'

export default function Events() {
    return (
        <>
            <header className={classes.header}>
                <h1>
                    Every week, a new event is waiting for you!
                </h1>
                <p>
                    Participate in exclusive  <span className={classes.highlight}>events</span> And
                    Find <span className={classes.highlight}>new friends & like-minded people</span>
                </p>
            </header>
            <main className={classes.main}>
                {/* <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}>
                    <Meals />
                </Suspense> */}
            </main>
        </>
    )
}