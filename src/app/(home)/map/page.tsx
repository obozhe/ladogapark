import MapImageMobile from 'images/map-mobile.avif';
import MapImage from 'images/map.avif';
import Image from 'next/image';
import { Entry } from '@prisma/client';
import MapObject from 'components/MapPage/MapObject';
import { objectsInfo } from 'core/mapObjects';
import { getEntryById } from 'server/objects/ObjectCollection';

type Props = {
  searchParams: { entryId?: string; index?: string };
};

const MapObjects = ({ entry, objectPositionIndex }: { entry: Entry | null; objectPositionIndex?: string }) => {
  return (
    <div className="absolute left-0 top-0 z-10 h-full w-full [@media(max-width:1470px)]:hidden">
      {Object.entries(objectsInfo).map(([objectType, objects]) =>
        objects.positions.map((objectPosition, index) => (
          <MapObject
            {...objectPosition}
            key={objectPosition.height + objectPosition.left + objects.title}
            title={objects.title}
            objectPositionIndex={String(index)}
            entry={entry?.id === objects.entryId && objectPositionIndex === String(index) && entry ? entry : null}
            entryId={objects.entryId}
            objectType={objectType}
          />
        ))
      )}
    </div>
  );
};

const Map = async ({ searchParams }: Props) => {
  const entry = searchParams?.entryId ? await getEntryById(searchParams.entryId) : null;

  return (
    <div className="layout-container">
      <h2 className="mb-10">Карта парка</h2>
      <div className="relative flex justify-center">
        <Image src={MapImage} alt="map" className="w-full [@media(max-width:1470px)]:hidden" />
        <Image src={MapImageMobile} alt="map" className="w-full [@media(min-width:1470px)]:hidden" />
        <MapObjects entry={entry} objectPositionIndex={searchParams?.index} />
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
