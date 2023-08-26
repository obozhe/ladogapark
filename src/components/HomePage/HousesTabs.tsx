'use client';

import useRouterParams from 'hooks/useRouterParams';
import { ObjectTypes } from 'server/objects/types';
import Tabs from 'ui/Tabs';

const rentOptions: Record<'label' | 'value', string | ObjectTypes>[] = [
  { label: 'На день', value: ObjectTypes.Daily },
  { label: 'На сутки', value: ObjectTypes.House },
  { label: 'Бани', value: ObjectTypes.Bath },
];

const HousesTabs = () => {
  const { setQueryParams } = useRouterParams();

  return (
    <Tabs
      tabs={rentOptions}
      activeTab={rentOptions[0].value}
      onClick={(value) => setQueryParams({ queryName: 'type', value })}
    />
  );
};

export default HousesTabs;
