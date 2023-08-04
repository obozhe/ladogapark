import BurgerIcon from 'icons/burger.svg';
import InstagramIcon from 'icons/instagram.svg';
import LogoMobileIcon from 'icons/logo-mobile.svg';
import LogoIcon from 'icons/logo.svg';
import TelegramIcon from 'icons/telegram.svg';
import VkIcon from 'icons/vk.svg';
import WhatsAppIcon from 'icons/whatsapp.svg';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex py-8 justify-between layout-container absolute lg:static w-full p-3">
      <div className="flex gap-24">
        <LogoMobileIcon className="lg:hidden" />
        <LogoIcon className="hidden lg:block" />
        <nav className="lg:self-end lg:font-bold lg:flex lg:gap-11 hidden">
          <Link href="/booking">Бронирование</Link>
          <Link href="/map">Карта парка</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/photos">Фотогалерея</Link>
          <Link href="/reviews">Отзывы</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
      </div>
      <div className="lg:flex lg:flex-col lg:font-semibold lg:justify-between lg:font-inter hidden">
        <div className="flex gap-4 self-end">
          <InstagramIcon />
          <TelegramIcon />
          <VkIcon />
          <WhatsAppIcon />
        </div>
        <span>+7 (929) 111-01-51</span>
        <span>+7 (929) 111-01-51</span>
      </div>
      <BurgerIcon className="lg:hidden" />
    </header>
  );
};

export default Header;
