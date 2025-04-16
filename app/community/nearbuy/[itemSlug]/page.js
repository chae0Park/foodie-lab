// community/nearbuy/[slug]/page.js
import classes from './page.module.css';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CheckSession from '@/components/CheckSession';
import Link from 'next/link';
import DeleteButton from '@/components/common/DeleteButton';
import { getItem } from '@/lib/item';

// 동적으로 메타데이터 설정
export async function generateMetadata({ params }) {
    const data = await getItem(params.itemSlug);  // await 추가
    if (!data) {
        return {
            title: 'Data Not Found',
            description: 'The data you are looking for was not found.',
        };
    }
    return {
        title: data.title,
        description: data.summary,
    };
}

export default async function NearbuyDetailPage({ params }) {
    const item = await getItem(params.itemSlug);

    if (!item) {
        notFound();
    }

    item.instructions = item.instructions.replace(/\n/g, '<br />');

    return(
        <>
        <div className={classes.headerTop}>
            <h1>{item.title}</h1>
            <p className={classes.creator}>
                <a href={`mailto: ${item.author.email}`}>{item.author.name}</a>
            </p>
        </div>
        
            

        <header className={classes.header}>
            <div className={classes.image}>
                <Image src={item.images} alt={item.title} fill />
            </div>

            <div className={classes.headerText}>
                <div className={classes.titleCreator}>
                
                    
                </div>
                
                <div className={classes.priceEditDelete}>
                    <p className={classes.summary}>${item.summary}</p>
                    <CheckSession authorEmail={item.author.email}>
                        <div className={classes.editDelete}>
                            <Link href={`/community/nearbuy/${item.slug}/edit`}>edit</Link>
                            <DeleteButton slug={item.slug} />
                        </div>
                    </CheckSession>
                </div>
                <main >
                    <p
                        className={classes.instructions}
                        dangerouslySetInnerHTML={{
                            __html: item.instructions,
                        }}
                    />
                </main>
            </div>
        </header>
        </>
    )

}