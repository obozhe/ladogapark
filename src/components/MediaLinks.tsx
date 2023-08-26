import { IconBrandInstagram, IconBrandTelegram, IconBrandVk, IconBrandWhatsapp } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
  className?: string;
  size?: number;
  color?: string;
};

const MediaLinks = ({ className, color, size = 20 }: Props) => {
  return (
    <>
      <Link href="https://www.instagram.com/ladoga_park/" target="_blank" className={className}>
        <IconBrandInstagram size={size} color={color} />
      </Link>
      <Link href="https://t.me/ladogapark" target="_blank" className={className}>
        <IconBrandTelegram size={size} color={color} />
      </Link>
      <Link href="https://vk.com/ladogapark" target="_blank" className={className}>
        <IconBrandVk size={size} color={color} />
      </Link>
      <Link href="https://wa.me/+79312130048" target="_blank" className={className}>
        <IconBrandWhatsapp size={size} color={color} />
      </Link>
    </>
  );
};

export default MediaLinks;
