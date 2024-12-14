// app/layout.tsx
import './globals.css'; // Import your global CSS file here
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    )
  }