// community/nearbuy/[slug]/page.js
import classes from './page.module.css';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import CheckSession from '@/components/CheckSession';
import Link from 'next/link';
import DeleteButton from '@/components/common/DeleteButton';
import { getItem } from '@/lib/item';

// 동적으로 메타데이터 설정
export async function generateMetadata({ params }: { params: { itemSlug: string } }) {
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

export default async function NearbuyDetailPage({ params }: { params: { itemSlug: string } }) {
    const item = await getItem(params.itemSlug);

    if (!item) {
        notFound();
    }

    item.instructions = item.instructions.replace(/\n/g, '<br />');

    return(
        <>
        <div className={classes.headerTop}>
            <h1>{item.title}</h1>
            <p className={classes.creator}>{item.author.name}</p>
            <button>채팅하기</button>
        </div>
        
            

        <header className={classes.header}>
            <div className={classes.image}>
                <Image src={item.images} alt={item.title} fill />
            </div>

            <div className={classes.headerText}>
                <div className={classes.titleCreator}> 
                </div>
                
                <div className={classes.priceEditDelete}>
                    <p className={classes.price}>${item.price}</p> 
                    <CheckSession authorEmail={item.author.email}>
                        <div className={classes.editDelete}>
                            <Link href={`/community/nearbuy/${item.slug}/edit`}>edit</Link>
                            <DeleteButton slug={item.slug} />
                        </div>
                    </CheckSession>
                </div>
                <p className={classes.tradeType}>{item.tradeType}</p> 
                <p className={classes.itemType}>{item.itemType}</p> 
                <main >
                    description:
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