'use client';

import { IconMenu2 } from '@tabler/icons-react';
import LogoMobileBlackIcon from 'icons/logo-mobile-black.svg';
import LogoMobileIcon from 'icons/logo-mobile.svg';
import LogoIcon from 'icons/logo.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import DropDown from 'ui/Dropdown';
import MediaLinks from './MediaLinks';

const navLinks = [
  { link: '/booking', title: 'Бронирование' },
  { link: '/map', title: 'Карта парка' },
  { link: '/services', title: 'Услуги' },
  { link: '/photos', title: 'Фотогалерея' },
  { link: '/contacts', title: 'Контакты' },
];

const Header = () => {
  const location = usePathname();
  const isHomePage = location === '/';

  return (
    <header
      className={twMerge(
        'layout-container mobile-container flex w-full justify-between py-8',
        isHomePage && 'absolute z-10 lg:static'
      )}
    >
      <div className="flex gap-5 xl:gap-24">
        <Link href="/" className="lg:hidden">
          {isHomePage ? <LogoMobileIcon /> : <LogoMobileBlackIcon />}
        </Link>
        <Link href="/" className="hidden lg:block">
          <LogoIcon />
        </Link>
        <nav className="hidden gap-5 lg:flex lg:self-end lg:font-bold xl:gap-11">
          {navLinks.map((navLink) => (
            <Link href={navLink.link} key={navLink.link}>
              {navLink.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:font-inter lg:font-semibold">
        <div className="flex gap-4 self-end">
          <MediaLinks />
        </div>
        <span>+7 (929) 111-01-51</span>
        <span>+7 (929) 111-01-51</span>
      </div>

      <DropDown
        className="lg:hidden"
        menuButton={<IconMenu2 size={40} color={isHomePage ? 'white' : 'black'} />}
        links={navLinks}
      />
    </header>
  );
};

export default Header;
