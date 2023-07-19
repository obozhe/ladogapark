import Header from 'components/Header/Header';
import type { Metadata, NextPage } from 'next';
import { Inter, Raleway } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';
import '../../public/globals.css';

const raleway = Raleway({ subsets: ['latin'], variable: '--raleway' });
const inter = Inter({ subsets: ['latin'], variable: '--inter' });

export const metadata: Metadata = {
  title: 'Ладога парк',
  description: 'База отдыха Ладога парк',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge(raleway.variable, inter.variable, 'font-raleway')}>{children}</body>
    </html>
  );
}
