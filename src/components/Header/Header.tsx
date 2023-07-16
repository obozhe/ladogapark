import InstagramIcon from 'icons/instagram.svg';
import LogoIcon from 'icons/logo.svg';
import TelegramIcon from 'icons/telegram.svg';
import VkIcon from 'icons/vk.svg';
import WhatsAppIcon from 'icons/whatsapp.svg';
import Link from 'next/link';
import prisma from 'lib/prisma';
const Header = () => {
  return (
    <header className="flex py-8 justify-between layout-container">
      <div className="flex gap-24">
        <LogoIcon />
        <nav className="self-end font-bold flex gap-11">
          <Link href="/booking">Бронирование</Link>
          <Link href="/map">Карта парка</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/photos">Фотогалерея</Link>
          <Link href="/reviews">Отзывы</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
      </div>
      <div className="flex flex-col font-semibold justify-between font-inter">
        <div className="flex gap-4 self-end">
          <InstagramIcon />
          <TelegramIcon />
          <VkIcon />
          <WhatsAppIcon />
        </div>
        <span>+7 (929) 111-01-51</span>
        <span>+7 (929) 111-01-51</span>
      </div>
    </header>
  );
};

export default Header;
