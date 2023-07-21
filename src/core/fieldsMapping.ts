import { ObjectTypes } from 'server/objects/types';

export const fieldsMapping = {
  [ObjectTypes.House]: 'Суточная',
  [ObjectTypes.Daily]: 'На день',
  [ObjectTypes.Bath]: 'Почасовая',
};
