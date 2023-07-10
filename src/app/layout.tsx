import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import Head from 'next/head'
import { twMerge } from 'tailwind-merge'
import { Header } from 'widgets/header'
import '../globals.css'

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
