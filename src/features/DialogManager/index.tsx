'use client';

import { DialogNames } from '../../containers/StateContext';
import { AddOrEditUnitNumberDialog } from 'components/ManagementPage/Objects/Entry/dialogs/AddOrEditUnitNumberDialog';
import { UnitTemporaryClosureDialog } from 'components/ManagementPage/Objects/Entry/dialogs/UnitTemporaryClosureDialog';
import { useStateContext } from 'hooks/useStateContext';

const getDialogByName = (name: DialogNames | null, props: any) => {
  switch (name) {
    case DialogNames.CreateUnit:
      return <AddOrEditUnitNumberDialog {...props} />;

    case DialogNames.EditUnitNumber:
      return <AddOrEditUnitNumberDialog {...props} />;

    case DialogNames.TemporaryCloseUnit:
      return <UnitTemporaryClosureDialog {...props} />;

    default:
      return null;
  }
};

const DialogManager = () => {
  const { name, props } = useStateContext();

  return getDialogByName(name, props);
};

export default DialogManager;
