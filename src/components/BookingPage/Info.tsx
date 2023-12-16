'use client';

import { sanitize } from 'isomorphic-dompurify';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useOutsideClick from 'hooks/useOutsideClick';
import { EntryWithFuturePricesWithGroup } from 'core/types/Prisma';
import { Transition } from '@headlessui/react';

type Props = {
  entry: EntryWithFuturePricesWithGroup;
};

const FullImage = ({ image, onClose, isOpen }: { image: string; onClose: () => void; isOpen: boolean }) => {
  const { ref } = useOutsideClick<HTMLDivElement>(onClose);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'initial';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!mounted) return;

  return createPortal(
    <Transition
      show={isOpen}
      appear={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
        <div className="relative h-1/2 w-1/2" ref={ref}>
          <Image
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={process.env.NEXT_PUBLIC_UPLOADS_URL + image}
            style={{ objectFit: 'contain' }}
            alt=""
          />
        </div>
      </div>
    </Transition>,
    document.body
  );
};

const Info = ({ entry }: Props) => {
  const [mainImage, setMainImage] = useState(entry.images[0]);
  const [showFull, setShowFull] = useState(false);

  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-col gap-5">
        <div className="relative h-[200px] min-[450px]:h-[450px]">
          <Image
            fill
            priority
            src={process.env.NEXT_PUBLIC_UPLOADS_URL + mainImage}
            alt="house image"
            className="cursor-pointer object-fill min-[450px]:object-contain"
            onClick={() => setShowFull(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // width={600}
            // height={300}
            // style={{ objectFit: 'cover' }}
            // className="h-[450px] w-full"
          />
        </div>
        <div className="flex h-[70px] gap-1 overflow-auto md:h-[100px]">
          {entry.images.map((image) => {
            return (
              <Image
                key={image}
                src={process.env.NEXT_PUBLIC_UPLOADS_URL + image}
                alt="house image"
                width={150}
                height={50}
                priority
                className="w-[150px] cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onClick={() => setMainImage(image)}
              />
            );
          })}
        </div>
        <div className="hidden flex-col gap-2 font-semibold lg:flex">
          <p className="text-xl">{entry.title}</p>
          <p>{entry.description}</p>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(entry.content),
            }}
          />
        </div>
      </div>
      <FullImage image={mainImage} onClose={() => setShowFull(false)} isOpen={showFull} />
    </section>
  );
};

export default Info;
