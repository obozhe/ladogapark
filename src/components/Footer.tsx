import LogoWhiteIcon from 'icons/logo-white.svg';
import Link from 'next/link';
import { getSettings } from 'server/settings';
import MediaLinks from './MediaLinks';

const Footer = async () => {
  const settings = await getSettings();

  return (
    <footer className="mt-[300px] bg-[#221F20] px-2 pb-5 pt-7 text-sm font-semibold text-white">
      <div className="layout-container flex justify-center pb-5 lg:justify-between lg:border-b-2 lg:border-white">
        <div className="flex gap-5 xl:gap-24">
          <LogoWhiteIcon />
          <div className="hidden grid-cols-3 grid-rows-4 gap-3 lg:grid">
            <Link href="/">Главная</Link>
            <Link href="/booking">Фотогалерея</Link>
            <Link href="/">Публичная оферта</Link>
            <Link href="/">Бронирование</Link>
            <Link href="/">Отзывы</Link>
            <Link href="/">Фирменный стиль</Link>
            <Link href="/">Карта парка</Link>
            <Link href="/">Контакты</Link>
            <Link href="/">Политика конфиденциальности</Link>
            <Link href="/">Услуги</Link>
          </div>
        </div>
        <div className="hidden flex-col gap-5 lg:flex">
          <div className="flex justify-between">
            <MediaLinks contacts={settings?.contacts} />
          </div>
          <div className="flex flex-col items-end font-inter">
            <span>{settings?.contacts.phones[0]}</span>
            <span>{settings?.contacts.phones[1]}</span>
          </div>
          <span>booking@ladogapark.ru</span>
        </div>
      </div>
      <div className="layout-container hidden justify-between pt-5 lg:flex">
        <span>
          {settings?.global.copyrights}, {settings?.global.foundingYear}-{new Date().getFullYear()}
        </span>
        <span>qtaki</span>
      </div>
    </footer>
  );
};

export default Footer;
