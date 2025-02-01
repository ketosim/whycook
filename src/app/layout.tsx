// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { Antonio } from 'next/font/google'
import { Gothic_A1 } from 'next/font/google'  // Import Gothic A1


// Initialize fonts before the component
const inter = Inter({
  subsets: ['latin']
})

const antonio = Antonio({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
})

const gothic_A1 = Gothic_A1({
  subsets: ['latin'],
  weight: ['500', '600'],  // Specify the weights you want to use
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
      <body className={`${inter.className} ${antonio.className} ${gothic_A1.className}`}>
      {children}
      </body>
    </html>
  )
}