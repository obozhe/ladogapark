'use client';

import Tippy from '@tippyjs/react/headless';
import Image from 'next/image';
import { forwardRef, useState } from 'react';
import { objectsInfo } from 'core/mapObjects';

type ObjectsType = 'picnicTable' | 'tent';
type ObjectProps = {
  top: number;
  left: number;
  width: number;
  height: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  objectType: string;
};

// eslint-disable-next-line react/display-name
const MapObject = forwardRef<HTMLDivElement, ObjectProps>(
  ({ top, left, width, height, onClick, onMouseEnter, onMouseLeave, objectType }, ref) => {
    return (
      <div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        style={{ top: top - width / 4, left: left - width / 4, width: width * 1.5, height: height * 1.5 }}
        className="absolute z-50 flex cursor-pointer items-center justify-center rounded-full bg-[hsla(0,0%,100%,.5)]"
      >
        <Image src={`/icons/map/${objectType}.svg`} alt={objectType} width={width} height={height} />
      </div>
    );
  }
);

const MapObjects = () => {
  const [highlightedType, setHighlightedType] = useState<ObjectsType | null>(null);

  return (
    <div className="absolute left-0 top-0 z-10 h-full w-full">
      {Object.entries(objectsInfo).map(([objectType, objects]) =>
        objects.positions.map((object) => (
          <Tippy
            render={(attrs) => (
              <div {...attrs} className="rounded-[10px] bg-white p-1 text-black">
                {objects.title}
              </div>
            )}
            key={`wrapper-${objectType}-${object.left}-${object.top}`}
          >
            <MapObject
              {...object}
              objectType={objectType}
              onMouseEnter={() => setHighlightedType(objectType as ObjectsType)}
              onMouseLeave={() => setHighlightedType(null)}
              onClick={() => {}}
            />
          </Tippy>
        ))
      )}
    </div>
  );
};

export default MapObjects;
