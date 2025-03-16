import MainHeader from '@/components/main-header/main-header';
import './globals.css';
import  Providers from '@/app/_components/Providers';

export const metadata = {
  title: 'NextLevel Food',
  description: 'Delicious meals, shared by a food-loving community.',
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
