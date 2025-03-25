import Link from "next/link";
import classes from './page.module.css';
import ImageSlideshow from '@/components/image/image-slideshow.js';

export default function Home() {
  return (
    <>
      <>
        <header className={classes.header}>
          <div className={classes.slideshow}>
            <ImageSlideshow />
          </div>
          <div>
            <div className={classes.hero}>
              <h1>Cook Smart, Eat Well</h1>
              <p>Revolutionizing Home Cooking with Everyday Ingredients</p>
            </div>
            <div className={classes.cta}>
              <Link href="/community">Join the Community</Link>
              <Link href="/meals">Explore Meals</Link>
            </div>
          </div>
        </header>
        <main>
          <section className={classes.section}>
            {/* <h2>Revolutionizing Home Cooking with Everyday Ingredients</h2> */}
            <p>
              In a world where the cost of living is rising and takeout has become a go-to, 
              we believe cooking at home can be both easy and affordable. 
            </p>
            <p>
              At Revive and Dine, we&apos;re on a mission to inspire creativity in the kitchen, save you money, 
              and help you stay healthy—all with the ingredients you already keep in your fridge.
            </p>
          </section>

          <section className={classes.section}>
            <h2>How It Works</h2>
            <p>
              Revive and Dine is a community-driven platform where foodies share their clever recipes made with what&apos;s in their fridge or even leftover takeout. 
              Whether it's turning last night&apos;s dinner into a new meal or utilizing pantry staples, 
            </p>
            <p>
              our goal is to help you find fresh inspiration to cook more at home, save money, and reduce food waste.
            </p>
          </section>
        </main>
      </>
    </>
  );
}
