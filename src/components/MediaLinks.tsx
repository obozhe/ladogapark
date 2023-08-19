import Link from 'next/link';
import { BrandInstagram, BrandTelegram, BrandVk, BrandWhatsapp } from 'tabler-icons-react';

type Props = {
  className?: string;
  size?: number;
  color?: string;
};

const MediaLinks = ({ className, color, size = 20 }: Props) => {
  return (
    <>
      <Link href="https://www.instagram.com/ladoga_park/" target="_blank" className={className}>
        <BrandInstagram size={size} color={color} />
      </Link>
      <Link href="https://t.me/ladogapark" target="_blank" className={className}>
        <BrandTelegram size={size} color={color} />
      </Link>
      <Link href="https://vk.com/ladogapark" target="_blank" className={className}>
        <BrandVk size={size} color={color} />
      </Link>
      <Link href="https://wa.me/+79312130048" target="_blank" className={className}>
        <BrandWhatsapp size={size} color={color} />
      </Link>
    </>
  );
};

export default MediaLinks;
