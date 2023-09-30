'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { Entry } from '@prisma/client';
import { House } from 'components/HomePage/Houses';
import useOutsideClick from 'hooks/useOutsideClick';
import useRouterParams from 'hooks/useRouterParams';

type ObjectProps = {
  top: number;
  left: number;
  width: number;
  height: number;
  title: string;
  objectType: string;
  objectPositionIndex: string;
  entryId?: string;
  entry: Entry | null;
};

const MapObject = ({
  top,
  left,
  width,
  height,
  objectType,
  entryId,
  title,
  entry,
  objectPositionIndex,
}: ObjectProps) => {
  const { setQueryParams, deleteQueryParams } = useRouterParams();
  const { ref } = useOutsideClick<HTMLDivElement>(() => deleteQueryParams('index', 'entryId'));

  return (
    <div
      className="absolute"
      style={{ top: top - width / 4, left: left - width / 4, width: width * 1.5, height: height * 1.5 }}
      ref={ref}
    >
      <div
        className={twMerge(
          'group absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full',
          entryId && 'bg-[hsla(0,0%,100%,.5)]'
        )}
        onClick={() => {
          if (!entryId) return;
          setQueryParams({ queryName: 'entryId', value: entryId }, { queryName: 'index', value: objectPositionIndex });
        }}
      >
        <span className="absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black p-2 text-white group-hover:inline-block">
          {title}
        </span>
        <Image src={`/icons/map/${objectType}.svg`} alt={objectType} width={width} height={height} />
      </div>
      {entry && (
        <div className="absolute left-1/2 top-full z-10 w-[300px] -translate-x-1/2">
          <House entry={entry} />
        </div>
      )}
    </div>
  );
};

export default MapObject;
