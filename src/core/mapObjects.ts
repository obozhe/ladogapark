type ObjectType =
  | 'abk'
  | 'arbor'
  | 'arborhexagonal-2'
  | 'arborhexagonal'
  | 'barnhouse.png'
  | 'bath-big'
  | 'bath-big2'
  | 'bath-veranda'
  | 'bath'
  | 'catering'
  | 'fisherman'
  | 'food-truck'
  | 'foresthouse-2'
  | 'foresthouse-4'
  | 'foresthouse'
  | 'grillhouse-big'
  | 'grillhouse-med'
  | 'grillhouse'
  | 'kpp1'
  | 'kpp2'
  | 'pavilion'
  | 'picnic'
  | 'playground'
  | 'playground2'
  | 'shop'
  | 'tent'
  | 'toilet'
  | 'trash'
  | 'veranda'
  | 'volleyball'
  | 'workout';

export const objectsInfo: Record<any, any> = {
  picnic: [
    { top: 130, left: 107, height: 24, width: 24 },
    { top: 130, left: 174, height: 24, width: 24 },
  ],
  tent: [{ top: 187, left: 127, height: 32, width: 32 }],
};
