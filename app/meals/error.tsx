'use client'; //페이지가 서버에서 렌더링 된 이 후의 error를 다루기 때문에
export default function Error(){
    return(
        <main className='error'> 
            <h1>An error occurred!</h1>
            <p>Failed to create meal.</p>
        </main>
    )
}