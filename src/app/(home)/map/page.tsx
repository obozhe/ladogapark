import MapImage from 'images/map.avif';
import Image from 'next/image';
import MapObjects from 'components/MapPage/MapObjects';
import { objectsInfo } from 'core/mapObjects';

const Map = async () => {
  return (
    <div className="layout-container">
      <h2 className="mb-10">Карта парка</h2>
      <div className="relative flex justify-center">
        <Image src={MapImage} alt="map" className="w-full" />
        {/* {Object.entries(objectsInfo).map(([objectType, objects]) =>
          objects.map((objectStyles) => (
            <Image
              style={{
                ...objectStyles,
              }}
              className="absolute"
              key={`${objectType}${objectStyles.left}`}
              src={`/icons/map/${objectType}.svg`}
              alt={objectType}
              width={objectStyles.width}
              height={objectStyles.height}
            />
          ))
        )} */}
        <MapObjects />
      </div>
    </div>
  );
};

export default Map;
