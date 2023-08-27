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
      className={twMerge('flex py-8 justify-between layout-container w-full', isHomePage && 'absolute z-10 lg:static')}
    >
      <div className="flex gap-5 xl:gap-24">
        <Link href="/" className="lg:hidden">
          {isHomePage ? <LogoMobileIcon /> : <LogoMobileBlackIcon />}
        </Link>
        <Link href="/" className="hidden lg:block">
          <LogoIcon />
        </Link>
        <nav className="lg:self-end lg:font-bold lg:flex gap-5 xl:gap-11 hidden">
          {navLinks.map((navLink) => (
            <Link href={navLink.link} key={navLink.link}>
              {navLink.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="lg:flex lg:flex-col lg:font-semibold lg:justify-between lg:font-inter hidden">
        <div className="flex gap-4 self-end">
          <MediaLinks />
        </div>
        <span>+7 (929) 111-01-51</span>
        <span>+7 (929) 111-01-51</span>
      </div>

      <DropDown
        className="lg:hidden"
        menuButton={<IconMenu2 size={40} color={isHomePage ? 'white' : 'black'} />}
        items={navLinks.map((navLink) => (
          <Link href={navLink.link} key={navLink.link} className="font-bold">
            {navLink.title}
          </Link>
        ))}
      />
    </header>
  );
};

export default Header;
