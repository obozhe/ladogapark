'use client';

import { IconCaretLeftFilled, IconCaretRightFilled } from '@tabler/icons-react';
import { sanitize } from 'isomorphic-dompurify';
import { TouchEvent, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  autoPlay: boolean;
  items: { title: string; content: string; date: string }[];
};

const Slider = ({ autoPlay, items }: Props) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchPosition, setTouchPosition] = useState<number | null>(null);

  useEffect(() => {
    if (!autoPlay || touchPosition) return;

    const intervalId = setInterval(() => {
      if (currentSlideIndex + 1 === items.length) {
        setCurrentSlideIndex(0);
        return;
      }

      setCurrentSlideIndex((prev) => prev + 1);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoPlay, items.length, currentSlideIndex, touchPosition]);

  const changeSlide = (num: number) => {
    if ((num < 0 && currentSlideIndex === 0) || (num > 0 && currentSlideIndex + 1 === items.length)) return;

    setCurrentSlideIndex((prev) => prev + num);
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => setTouchPosition(e.touches[0].clientX);
  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchPosition) return;

    const currentPosition = e.touches[0].clientX;
    const direction = touchPosition - currentPosition;

    console.log(direction);

    if (direction > 10) {
      changeSlide(1);
    }

    if (direction < -10) {
      changeSlide(-1);
    }

    setTouchPosition(null);
  };

  return (
    <div className=" flex w-full flex-col gap-[10px] text-white md:w-fit">
      <div className="flex w-full items-center gap-[10px] md:w-fit">
        <IconCaretLeftFilled className="hidden md:block" onClick={() => changeSlide(-1)} />
        <div
          className="relative overflow-hidden rounded-2xl bg-white bg-opacity-30"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          <div
            className="flex h-full w-full transition-transform duration-[400ms]"
            style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
          >
            {items.map((item) => (
              <div
                className="relative flex flex-[1_0_100%] flex-col gap-2 p-4"
                key={`slide-${item.title}-${item.date}`}
              >
                <div className="flex justify-between">
                  <span>{item.title}</span>
                  <span>{item.date}</span>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitize(item.content),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <IconCaretRightFilled className="hidden md:block" onClick={() => changeSlide(1)} />
      </div>

      <div className="flex justify-center gap-[10px]">
        {items.map((item, index) => (
          <span
            className={twMerge(
              'h-[10px] w-[10px] cursor-pointer rounded-full bg-white opacity-30',
              currentSlideIndex === index && 'opacity-100'
            )}
            key={`circle-${item.title}-${item.date}`}
            onClick={() => setCurrentSlideIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
