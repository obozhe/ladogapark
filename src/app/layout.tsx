import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { Metadata } from 'next';
import { Inter, Raleway } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import '../../public/globals.css';

dayjs.locale('ru');

const raleway = Raleway({ subsets: ['latin'], variable: '--raleway' });
const inter = Inter({ subsets: ['latin'], variable: '--inter' });

export const metadata: Metadata = {
  title: 'Ладога парк',
  description: 'База отдыха Ладога парк',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge(raleway.variable, inter.variable, 'bg-[#F7FAFC] font-raleway')}>{children}</body>
    </html>
  );
}
