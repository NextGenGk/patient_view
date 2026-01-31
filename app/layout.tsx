import type { Metadata } from 'next';
<<<<<<< HEAD
// Temporarily commented out due to network connectivity issues during build
// import { Inter } from 'next/font/google';
// import { Alatsi } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';

// Using system fonts as fallback
// const inter = Inter({ subsets: ['latin'] });
// const alatsi = Alatsi({ weight: '400', subsets: ['latin'] });
=======
import { Inter } from 'next/font/google';
import { Alatsi } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });
const alatsi = Alatsi({ weight: '400', subsets: ['latin'] });
>>>>>>> 15f2075 (Patien_View final ver)

export const metadata: Metadata = {
  title: 'AuraSutra - Ayurvedic Healthcare Platform',
  description: 'Connect with verified Ayurvedic doctors for online and offline consultations',
  keywords: ['ayurveda', 'healthcare', 'telemedicine', 'consultations', 'wellness'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
<<<<<<< HEAD
        {/* Google Fonts temporarily disabled due to network issues */}
      </head>
      <body className="font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
=======
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
>>>>>>> 15f2075 (Patien_View final ver)
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1F2937',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
