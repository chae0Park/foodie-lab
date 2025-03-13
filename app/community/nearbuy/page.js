import classes from './page.module.css'

export default function NearBuy(){
    return(
        <>
            <header className={classes.header}>
                <h1>
                Share or Split your extra ingredients! 
                </h1>
                <p>
                You can sell or share your extra ingredients with other members!
                </p>
            </header>
            <main className={classes.main}>
                {/* <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}> 
                    <Meals/>
                </Suspense> */}
            </main>
        </>
    )
}