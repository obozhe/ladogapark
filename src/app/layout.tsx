import DialogManager from 'features/DialogManager';
import type { Metadata } from 'next';
import { Inter, Raleway } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import StateContextProvider from 'containers/StateContext';
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
      <body className={twMerge(raleway.variable, inter.variable, 'font-raleway')}>
        <StateContextProvider>
          {children}
          <DialogManager />
        </StateContextProvider>
      </body>
    </html>
  );
}
