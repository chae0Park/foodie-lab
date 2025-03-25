import MainHeader from '@/components/main-header/main-header';
import './globals.css';
import  Providers from '@/app/_components/Providers';

export const metadata = {
  title: 'Revive & Dine',
  description: 'Revolutionizing Home Cooking with Everyday Ingredients.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
