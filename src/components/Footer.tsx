import InstagramIcon from 'icons/instagram.svg';
import LogoWhiteIcon from 'icons/logo-white.svg';
import TelegramIcon from 'icons/telegram.svg';
import VkIcon from 'icons/vk.svg';
import WhatsAppIcon from 'icons/whatsapp.svg';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#221F20] pt-7 pb-5 text-white font-semibold text-sm">
      <div className="layout-container flex justify-between border-b-2 border-white pb-5">
        <div className="flex gap-24">
          <LogoWhiteIcon />
          <div className="grid grid-cols-3 grid-rows-4 gap-3">
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
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <Link href="/">
              <InstagramIcon className="fill-white" />
            </Link>
            <Link href="/">
              <TelegramIcon fill="white" />
            </Link>
            <Link href="/">
              <VkIcon className="fill-white" />
            </Link>
            <Link href="/">
              <WhatsAppIcon className="fill-white" />
            </Link>
          </div>
          <div className="flex flex-col items-end font-inter">
            <span>+7 (929) 111-01-51</span>
            <span> +7 (931) 213-00-48</span>
          </div>
          <span>booking@ladogapark.ru</span>
        </div>
      </div>
      <div className="flex justify-between pt-5 layout-container">
        <span>© ООО «Аква Марин Групп», 2005-2023</span>
        <span>qtaki</span>
      </div>
    </footer>
  );
};

export default Footer;
