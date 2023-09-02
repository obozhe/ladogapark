'use client';

import { useState } from 'react';
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
};

const MapObject = ({ top, left, width, height, onClick, onMouseEnter, onMouseLeave }: ObjectProps) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ top: top - width / 2, left: left - width / 2, width: width * 2, height: height * 2 }}
      className="absolute cursor-pointer rounded-full bg-white opacity-30"
    />
  );
};

const MapObjects = () => {
  const [highlightedType, setHighlightedType] = useState<ObjectsType | null>(null);

  return (
    <div className="absolute left-0 top-0 z-10 h-full w-full">
      {/* {Object.entries(objectsInfo).map(([objectType, objects]) =>
        objects.map((object, index) => (
          <MapObject
            {...object}
            key={`${objectType}-${index}`}
            onMouseEnter={() => setHighlightedType(objectType as ObjectsType)}
            onMouseLeave={() => setHighlightedType(null)}
            onClick={() => {}}
          />
        ))
      )} */}
    </div>
  );
};

export default MapObjects;
