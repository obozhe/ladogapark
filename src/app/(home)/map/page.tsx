import MapImage from 'images/map.avif';
import Image from 'next/image';

const Map = () => {
  return (
    <div className="layout-container">
      <h2 className="mb-10">Карта парка</h2>
      <div className="flex justify-center relative">
        <Image src={MapImage} alt="map" />
      </div>
    </div>
  );
};

export default Map;
