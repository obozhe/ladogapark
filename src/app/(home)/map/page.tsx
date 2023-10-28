import MapImageMobile from 'images/map-mobile.avif';
import MapImage from 'images/map.avif';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { objectsInfo } from 'core/mapObjects';

const MapObjects = () => {
  return (
    <div className="absolute left-0 top-0 z-10 h-full w-full [@media(max-width:1470px)]:hidden">
      {Object.entries(objectsInfo).map(([objectType, objects]) =>
        objects.positions.map((objectPosition) => {
          const { top, width, height, left } = objectPosition;
          return (
            <div
              key={`${height}${left}${objects.title}`}
              className="absolute"
              style={{ top: top - width / 4, left: left - width / 4, width: width * 1.5, height: height * 1.5 }}
            >
              <div
                className={twMerge(
                  'group absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full',
                  objects.entryId && 'bg-[hsla(0,0%,100%,.5)]'
                )}
              >
                <span className="absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black p-2 text-white group-hover:inline-block">
                  {objects.title}
                </span>
                <Image src={`/icons/map/${objectType}.svg`} alt={objectType} width={width} height={height} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const Map = async () => {
  return (
    <div className="layout-container">
      <h2 className="mb-10">Карта парка</h2>
      <div className="relative flex justify-center">
        <Image src={MapImage} alt="map" className="w-full [@media(max-width:1470px)]:hidden" />
        <Image src={MapImageMobile} alt="map" className="w-full [@media(min-width:1470px)]:hidden" />
        <MapObjects />
      </div>
      <h2>Объекты для бронирования</h2>
      <div className="grid grid-cols-5">
        {Object.entries(objectsInfo).map(([objectType, objects]) => (
          <div key={`info-${objects.title}`} className="flex gap-2">
            <span>
              <Image width={32} height={32} src={`/icons/map/${objectType}.svg`} alt="" />
            </span>
            <span>{objects.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Map;
