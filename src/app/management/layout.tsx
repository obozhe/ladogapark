'use client';

import type { Metadata } from 'next';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavTabs from 'ui/NavTabs';

const tabs = [
  {
    label: 'Объекты',
    path: '/management/objects',
  },
  {
    label: 'Пользователи',
    path: '/management/users',
  },
];

const theme = createTheme({
  typography: { fontFamily: 'Raleway, sans-serif' },
  // palette: {
  //   primary: {
  //     main: '#221F20',
  //   },
  //   secondary: {
  //     main: '#FFAA05',
  //   },
  // },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <div className="h-full grid grid-cols-[260px,_1fr]">
        <div className="bg-black relative">
          <div className="fixed w-[260px] p-4">
            <NavTabs tabs={tabs} vertical />
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-200 relative">{children}</div>
      </div>
    </ThemeProvider>
  );
}
