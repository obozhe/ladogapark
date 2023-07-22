'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  links: { title: string; link: string; isActive?: boolean }[];
};

export default function NavHeader({ links }: Props) {
  return (
    <div className="w-full bg-white p-4 rounded mb-8">
      {links.map((link, i) => (
        <span key={link.link}>
          {i !== links.length - 1 ? (
            <Link href={link.link} className="link">
              {link.title}
            </Link>
          ) : (
            <span className="font-semibold">{link.title}</span>
          )}
          {i !== links.length - 1 && <span className="mx-1 text-gray-300"> / </span>}
        </span>
      ))}
    </div>
  );
}
