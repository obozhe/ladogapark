import Header from 'components/Header/Header'
import type { Metadata } from 'next'
import { Inter, Raleway } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import '../assets/globals.css'

const raleway = Raleway({ subsets: ['latin'], variable: '--raleway' })
const inter = Inter({ subsets: ['latin'], variable: '--inter' })

export const metadata: Metadata = {
  title: 'Ладога парк',
  description: 'База отдыха Ладога парк',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge(raleway.variable, inter.variable, 'font-raleway')}>
        <Header />
        {children}
      </body>
    </html>
  )
}
