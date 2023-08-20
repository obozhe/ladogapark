'use client';

import LogoMobileIcon from 'icons/logo-mobile.svg';
import LogoIcon from 'icons/logo.svg';
import Link from 'next/link';
import { Menu2 } from 'tabler-icons-react';
import DropDown from 'ui/Dropdown';
import MediaLinks from './MediaLinks';

const navLinks = [
  { link: '/booking', title: 'Бронирование' },
  { link: '/map', title: 'Карта парка' },
  { link: '/services', title: 'Услуги' },
  { link: '/photos', title: 'Фотогалерея' },
  { link: '/reviews', title: 'Отзывы' },
  { link: '/contacts', title: 'Контакты' },
];

const Header = () => {
  return (
    <header className="flex py-8 justify-between layout-container absolute z-10 lg:static w-full p-3">
      <div className="flex gap-5 xl:gap-24">
        <Link href="/" className="lg:hidden">
          <LogoMobileIcon />
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
        menuButton={<Menu2 size={40} />}
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
