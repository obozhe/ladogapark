'use client';

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

const YandexMap = () => {
  const center = [60.0551526526102, 31.0776331153449];
  return (
    <YMaps query={{ load: 'package.full' }}>
      <Map
        state={{
          center,
          zoom: 14,
          controls: [],
        }}
        width="100%"
        height="340px"
      >
        <Placemark geometry={center} options={{ preset: 'islands#blueHomeCircleIcon' }} />
      </Map>
    </YMaps>
  );
};

export default YandexMap;
