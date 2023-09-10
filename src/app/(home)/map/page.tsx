import MapImage from 'images/map-final.avif';
import Image from 'next/image';
import MapObjects from 'components/MapPage/MapObjects';
import { objectsInfo } from 'core/mapObjects';

const Map = async () => {
  return (
    <div className="layout-container">
      <h2 className="mb-10">Карта парка</h2>
      <div className="relative flex justify-center">
        <Image src={MapImage} alt="map" className="w-full" />
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
