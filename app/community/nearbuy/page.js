import classes from './page.module.css';
import CheckAccessToken from '@/components/check-accessToken';
import WriteLinkBtn from '@/components/common/write-link-btn';
import Grid from '@/components/common/grid';
import { getItems } from '@/lib/item';


async function Items(){
    const items = await getItems(); 
    return <Grid items={items} />
}


export default function NearBuy(){
    return(
        <CheckAccessToken>
            <header className={classes.header}>
                <h1>
                Share or sell your extra ingredients or kitchenwares! 
                </h1>
                <WriteLinkBtn href={'/community/nearbuy/post'}>add your item</WriteLinkBtn>
            </header>
            <main className={classes.main}>
                <Suspense fallback={<p className={classes.loading}>Fetching meals...</p>}> 
                    <Items/>
                </Suspense>
            </main>
        </CheckAccessToken>
    )
}