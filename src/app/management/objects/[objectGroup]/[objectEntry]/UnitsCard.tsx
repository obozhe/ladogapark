'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { Plus, Settings } from 'lucide-react';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';
import { ObjectUnit } from '@prisma/client';
import { DialogNames } from 'containers/StateContext';
import IsActiveField from 'components/ManagementPage/IsActiveField';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import BlockLoader from 'ui/BlockLoader';
import Button from 'ui/Button';
import Card from 'ui/Card';
import Dialog from 'ui/Dialog';
import Input from 'ui/Input';
import Menu from 'ui/Menu';
import Tooltip from 'ui/Tooltip';

const getAllUnitsNumbers = (url: string) => axios.get<string[]>(url);
const getUnits = (url: string) => axios.get<ObjectUnit[]>(url);

export const AddOrEditUnitNumberDialog = () => {
  const {
    isOpen,
    close,
    props: { onClose, unitId, objectEntryId, unitNumber },
  } = useStateContext();

  const {
    data: unitNumbers = [],
    mutate: loadNumbers,
    isValidating: isLoadingNumbers,
  } = useSWR(`/management/objects/units/numbers`, getAllUnitsNumbers);

  const unitNumberSchema = z.object({
    unitNumber: z
      .string()
      .regex(/^0*?[1-9]\d*$/, 'Введите положительное число (01, 11, ...)')
      .refine(
        (number) => !unitNumbers.includes(number),
        (number) => ({ message: `Юнит с номером ${number} уже существует` })
      ),
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(unitNumberSchema),
    mode: 'onChange',
    defaultValues: {
      unitNumber: unitNumber || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadNumbers();
    }
  }, [isOpen, loadNumbers]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const onSubmit = () => {
    if (isValid) {
      let request;
      if (objectEntryId) {
        request = axios.post('/management/objects/units', { objectEntryId, number: getValues().unitNumber });
      }

      if (unitNumber && unitId) {
        request = axios.post(`/management/objects/units/${unitId}`, { number: getValues().unitNumber });
      }

      request?.then(() => onClose(getValues().unitNumber));
      close();
    }
  };

  return (
    <Dialog
      title={unitId && unitNumber ? `Редактировать юнит "${unitNumber}"` : 'Добавить юнит'}
      isOpen={isOpen}
      onClose={close}
      onSubmit={onSubmit}
      submitLabel="Сохранить"
      disabled={!isValid}
      isLoading={isLoadingNumbers}
    >
      <form className="w-72" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="number"
          label="Номер"
          error={errors.unitNumber?.message as string}
          onKeyDown={onKeyDown}
          {...register('unitNumber')}
        />
      </form>
    </Dialog>
  );
};

type Props = { objectEntryId: string };

export default function UnitsCard({ objectEntryId }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);

  const { open } = useStateContext();

  const {
    data: units = [],
    isLoading,
    mutate,
  } = useSWR(`/management/objects/units?objectEntryId=${objectEntryId}`, getUnits);

  const toggleIsActiveUnit = async (unitId: string, isActive: boolean) => {
    setIsUpdating(true);
    await axios.post(`/management/objects/units/${unitId}`, { isActive: !isActive });
    setIsUpdating(false);

    const index = units.findIndex((unit) => unit.id === unitId);
    units[index] = {
      ...units[index],
      isActive: !isActive,
    };
    mutate([...units]);
  };

  const deleteUnit = async (unitId: string) => {
    setIsUpdating(true);
    await axios.delete(`/management/objects/units/${unitId}`);
    setIsUpdating(false);

    const unitsFiltered = units.filter((unit) => unit.id !== unitId);
    mutate(unitsFiltered);
  };

  const openAddNewUnitDialog = () => {
    open(DialogNames.CreateUnit, { onClose: onDialogClose, objectEntryId });
  };

  const openEditUnitNumberDialog = (unitId: string, unitNumber: string) => {
    open(DialogNames.EditUnitNumber, { onClose: onDialogClose, unitId, unitNumber });
  };

  const onDialogClose = (unitNumber?: string) => {
    if (unitNumber) {
      mutate();
    }
  };

  return (
    <BlockLoader isLoading={isLoading || isUpdating}>
      <Card
        title="Юниты"
        titleComponent={
          <Button isIconButton color="primary" size="xs" onClick={openAddNewUnitDialog}>
            <Plus />
          </Button>
        }
      >
        <div className="flex flex-col gap-1">
          {units.map((unit) => (
            <div key={unit.number} className="flex items-center justify-between">
              <div className="flex gap-2 place-items-center">
                <Tooltip id={String(unit.number)} content={unit.isActive ? 'Открыт' : 'Закрыт'}>
                  <IsActiveField hideText isActive={unit.isActive} />
                </Tooltip>
                <span className="ml-2">{unit.number}</span>
              </div>

              <Menu
                buttonComponent={
                  <div className="flex place-items-center p-1 rounded text-primary hover:bg-gray-200">
                    <Settings size={20} />
                  </div>
                }
                menuItems={[
                  {
                    label: unit.isActive ? 'Закрыть' : 'Открыть',
                    onClick: () => {
                      toggleIsActiveUnit(unit.id, unit.isActive);
                    },
                  },
                  {
                    label: ' Временно закрыть',
                    onClick: () => {},
                  },
                  {
                    label: 'Изменить номер',
                    onClick: () => openEditUnitNumberDialog(unit.id, unit.number),
                  },
                  {
                    label: 'Удалить',
                    onClick: () => {
                      deleteUnit(unit.id);
                    },
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </Card>
    </BlockLoader>
  );
}
