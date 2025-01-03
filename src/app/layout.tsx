// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Antonio } from 'next/font/google'

// Initialize fonts before the component
const inter = Inter({
  subsets: ['latin']
})

const antonio = Antonio({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
})

// Define the layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${antonio.className}`}>
        {children}
      </body>
    </html>
  )
}