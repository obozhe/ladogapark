import { IconBrandInstagram, IconBrandTelegram, IconBrandVk, IconBrandWhatsapp } from '@tabler/icons-react';
import Link from 'next/link';
import { Contacts } from '@prisma/client';

type Props = {
  className?: string;
  size?: number;
  color?: string;
  contacts?: Contacts;
};

const MediaLinks = ({ className, color, size = 20, contacts }: Props) => {
  return (
    <>
      <Link href={contacts?.instagram ?? ''} target="_blank" className={className}>
        <IconBrandInstagram size={size} color={color} />
      </Link>
      <Link href={contacts?.telegram ?? ''} target="_blank" className={className}>
        <IconBrandTelegram size={size} color={color} />
      </Link>
      <Link href={contacts?.vk ?? ''} target="_blank" className={className}>
        <IconBrandVk size={size} color={color} />
      </Link>
      <Link href={contacts?.whatsapp ?? ''} target="_blank" className={className}>
        <IconBrandWhatsapp size={size} color={color} />
      </Link>
    </>
  );
};

export default MediaLinks;
