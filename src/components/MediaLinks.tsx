import InstagramBlackIcon from 'icons/instagram-black.svg';
import InstagramWhiteIcon from 'icons/instagram-white.svg';
import TelegramBlackIcon from 'icons/telegram-black.svg';
import TelegramWhiteIcon from 'icons/telegram-white.svg';
import VkBlackIcon from 'icons/vk-black.svg';
import VkWhiteIcon from 'icons/vk-white.svg';
import WhatsAppBlackIcon from 'icons/whatsapp-black.svg';
import WhatsAppWhiteIcon from 'icons/whatsapp-white.svg';
import Link from 'next/link';

type Props = {
  iconColor?: 'black' | 'white';
  className?: string;
};

const MediaLinks = ({ className, iconColor }: Props) => {
  return (
    <>
      <Link href="https://www.instagram.com/ladoga_park/" target="_blank" className={className}>
        {iconColor === 'white' ? <InstagramWhiteIcon /> : <InstagramBlackIcon />}
      </Link>
      <Link href="https://t.me/ladogapark" target="_blank" className={className}>
        {iconColor === 'white' ? <TelegramWhiteIcon /> : <TelegramBlackIcon />}
      </Link>
      <Link href="https://vk.com/ladogapark" target="_blank" className={className}>
        {iconColor === 'white' ? <VkWhiteIcon /> : <VkBlackIcon />}
      </Link>
      <Link href="https://wa.me/+79312130048" target="_blank" className={className}>
        {iconColor === 'white' ? <WhatsAppWhiteIcon /> : <WhatsAppBlackIcon />}
      </Link>
    </>
  );
};

export default MediaLinks;
