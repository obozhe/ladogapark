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

// export const objectsInfo: Record<
//   ObjectType,
//   { positions: { top: number; left: number; height: number; width: number }[]; title: string }
// > = {
export const objectsInfo: any = {
  picnic: {
    positions: [
      { top: 130, left: 107, height: 24, width: 24 },
      { top: 130, left: 174, height: 24, width: 24 },
    ],
    title: 'Столик для пикника',
  },
  tent: {
    positions: [
      { top: 187, left: 127, height: 32, width: 32 },
      { top: 190, left: 525, height: 32, width: 32 },
      { top: 200, left: 593, height: 32, width: 32 },
      { top: 217, left: 659, height: 32, width: 32 },
    ],
    title: 'Шатер',
  },
  fisherman: {
    positions: [{ top: 200, left: 273, height: 32, width: 32 }],
    title: 'Домик рыбака',
  },
  bath: {
    positions: [{ top: 188, left: 333, height: 32, width: 32 }],
    title: 'Кедровая баня',
  },
  catering: {
    positions: [{ top: 222, left: 353, height: 32, width: 32 }],
    title: 'Кайтерская',
  },
  'bath-big2': {
    positions: [{ top: 197, left: 423, height: 60, width: 60 }],
    title: 'Большая кедровая баня',
  },
  grillhouse: {
    positions: [
      { top: 240, left: 506, height: 32, width: 32 },
      { top: 270, left: 694, height: 32, width: 32 },
      { top: 263, left: 797, height: 32, width: 32 },
    ],
    title: 'Гриль-домик',
  },
  'grillhouse-big': {
    positions: [
      { top: 247, left: 897, height: 45, width: 45 },
      { top: 254, left: 600, height: 45, width: 45 },
    ],
    title: 'Гриль-домик с террасой под навесом',
  },
  arbor: {
    positions: [
      { top: 231, left: 739, height: 32, width: 32 },
      { top: 212, left: 838, height: 32, width: 32 },
      { top: 191, left: 940, height: 32, width: 32 },
      { top: 194, left: 1235, height: 32, width: 32 },
    ],
    title: 'Беседка открытая',
  },
  arborhexagonal: {
    positions: [{ top: 197, left: 1397, height: 32, width: 32 }],
    title: 'Беседка восьмигранная',
  },
};
