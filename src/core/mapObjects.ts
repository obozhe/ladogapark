type ObjectType =
  | 'abk'
  | 'arbor'
  | 'arborhexagonal'
  | 'arborhexagonal-2'
  | 'barnhouse'
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
  | 'volleyball';

export const objectsInfo: Record<
  ObjectType,
  { positions: { top: number; left: number; height: number; width: number }[]; title: string; entryId?: string }
> = {
  picnic: {
    positions: [
      { top: 130, left: 107, height: 24, width: 24 },
      { top: 130, left: 174, height: 24, width: 24 },
    ],
    title: 'Столик для пикника',
    entryId: '64e27c49bee3891b2febcbd7',
  },
  tent: {
    positions: [
      { top: 187, left: 127, height: 32, width: 32 },
      { top: 190, left: 525, height: 32, width: 32 },
      { top: 200, left: 593, height: 32, width: 32 },
      { top: 217, left: 659, height: 32, width: 32 },
    ],
    title: 'Шатер',
    entryId: '64e27c49bee3891b2febcbdd',
  },
  fisherman: {
    positions: [{ top: 200, left: 273, height: 32, width: 32 }],
    title: 'Домик рыбака',
    entryId: '64e27c49bee3891b2febcbde',
  },
  bath: {
    positions: [{ top: 188, left: 333, height: 32, width: 32 }],
    title: 'Кедровая баня',
  },
  catering: {
    positions: [{ top: 222, left: 353, height: 32, width: 32 }],
    title: 'Кайтерская',
    entryId: '64e27c49bee3891b2febcbd2',
  },
  'bath-big2': {
    positions: [{ top: 197, left: 423, height: 60, width: 60 }],
    title: 'Большая кедровая баня',
    entryId: '64e27c49bee3891b2febcbd8',
  },
  grillhouse: {
    positions: [
      { top: 240, left: 506, height: 32, width: 32 },
      { top: 270, left: 694, height: 32, width: 32 },
      { top: 263, left: 797, height: 32, width: 32 },
    ],
    title: 'Гриль-домик',
    entryId: '64e27c3dbee3891b2febcbca',
  },
  'grillhouse-big': {
    positions: [
      { top: 247, left: 897, height: 45, width: 45 },
      { top: 254, left: 600, height: 45, width: 45 },
    ],
    title: 'Гриль-домик с террасой под навесом',
    entryId: '64e27c3dbee3891b2febcbcd',
  },
  arbor: {
    positions: [
      { top: 231, left: 739, height: 32, width: 32 },
      { top: 212, left: 838, height: 32, width: 32 },
      { top: 191, left: 940, height: 32, width: 32 },
      { top: 194, left: 1235, height: 32, width: 32 },
    ],
    title: 'Беседка открытая',
    entryId: '64e27c48bee3891b2febcbcf',
  },
  arborhexagonal: {
    positions: [
      { top: 175, left: 1009, height: 32, width: 32 },
      { top: 197, left: 1145, height: 32, width: 32 },
      { top: 185, left: 1078, height: 32, width: 32 },
    ],
    title: 'Беседка шестигранная',
    entryId: '64e27c49bee3891b2febcbd3',
  },
  'arborhexagonal-2': {
    positions: [{ top: 197, left: 1397, height: 32, width: 32 }],
    title: 'Беседка восьмигранная',
    entryId: '64e27c49bee3891b2febcbd6',
  },
  veranda: {
    positions: [
      { left: 1326, top: 284, height: 32, width: 32 },
      { left: 1232, top: 284, height: 32, width: 32 },
    ],
    title: 'Веранда на берегу',
    entryId: '64e27c3cbee3891b2febcbb3',
  },
  shop: {
    positions: [{ left: 198, top: 300, height: 32, width: 32 }],
    title: 'Магазин',
  },
  kpp1: {
    positions: [{ left: 145, top: 315, height: 32, width: 32 }],
    title: 'КПП',
  },
  abk: {
    positions: [
      { left: 73, top: 361, height: 32, width: 32 },
      { left: 409, top: 838, height: 32, width: 32 },
    ],
    title: 'АБК',
  },
  'food-truck': {
    positions: [{ left: 303, top: 397, height: 50, width: 50 }],
    title: 'Фудтрак',
  },
  trash: {
    positions: [{ left: 414, top: 352, height: 32, width: 32 }],
    title: 'Мусорный бак',
  },
  kpp2: {
    positions: [
      { left: 628, top: 329, height: 32, width: 32 },
      { left: 989, top: 329, height: 32, width: 32 },
    ],
    title: 'КПП',
  },
  toilet: {
    positions: [
      { left: 391, top: 465, height: 32, width: 32 },
      { left: 900, top: 465, height: 32, width: 32 },
    ],
    title: 'Туалет',
  },
  foresthouse: {
    positions: [
      { left: 350, top: 499, height: 40, width: 40 },
      { left: 363, top: 580, height: 40, width: 40 },
      { left: 376, top: 661, height: 40, width: 40 },
    ],
    title: 'Дом в лесу',
    entryId: '64e27c4abee3891b2febcbe0',
  },
  pavilion: {
    positions: [{ left: 410, top: 540, height: 32, width: 32 }],
    title: 'Павильон',
    entryId: '64e27c3dbee3891b2febcbcb',
  },
  barnhouse: {
    positions: [
      { left: 562, top: 519, height: 32, width: 32 },
      { left: 617, top: 519, height: 32, width: 32 },
      { left: 684, top: 519, height: 32, width: 32 },
      { left: 740, top: 519, height: 32, width: 32 },
    ],
    title: 'Барнхаус',
  },
  'bath-veranda': {
    positions: [{ left: 452, top: 734, height: 60, width: 60 }],
    title: 'Баня в лесу',
    entryId: '64e27c49bee3891b2febcbda',
  },
  'foresthouse-2': {
    positions: [
      { left: 183, top: 598, height: 32, width: 32 },
      { left: 240, top: 610, height: 32, width: 32 },
      { left: 185, top: 655, height: 32, width: 32 },
      { left: 240, top: 665, height: 32, width: 32 },
      { left: 185, top: 710, height: 32, width: 32 },
      { left: 240, top: 720, height: 32, width: 32 },
    ],
    title: 'Мини-домик на 2 человека',
  },
  'foresthouse-4': {
    positions: [
      { left: 218, top: 784, height: 32, width: 32 },
      { left: 241, top: 843, height: 32, width: 32 },
    ],
    title: 'Мини-дом на 4 человека',
  },
  volleyball: {
    positions: [
      { top: 140, left: 450, height: 32, width: 32 },
      { top: 140, left: 838, height: 32, width: 32 },
    ],
    title: 'Волейбольная площадка',
  },
  playground: {
    positions: [{ top: 174, left: 565, height: 32, width: 32 }],
    title: 'Детская площадка',
  },
  playground2: {
    positions: [{ left: 232, top: 520, height: 32, width: 32 }],
    title: 'Детская площадка (качели, песочница)',
  },
};
