'use client';

import { AddOrEditUnitNumberDialog } from 'app/management/objects/[objectGroup]/[objectEntry]/UnitsCard';
import { useStateContext } from 'hooks/useStateContext';
import { DialogNames } from '../../containers/StateContext';

const getDialogByName = (name: DialogNames | null, props: any) => {
  switch (name) {
    case DialogNames.CreateUnit:
      return <AddOrEditUnitNumberDialog {...props} />;

    case DialogNames.EditUnitNumber:
      return <AddOrEditUnitNumberDialog {...props} />;

    default:
      return null;
  }
};

const DialogManager = () => {
  const { name, props } = useStateContext();

  return getDialogByName(name, props);
};

export default DialogManager;
