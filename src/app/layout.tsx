import Header from 'components/Header/Header'
import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import '../assets/globals.css'

const raleway = Raleway({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ладога парк',
  description: 'База отдыха Ладога парк',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge(raleway.className, '')}>
        <Header />
        {children}
      </body>
    </html>
  )
}
