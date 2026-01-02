import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}