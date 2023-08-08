'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import { ControlledInputMUI } from 'mui/Input';
import Dialog from 'ui/Dialog';

const getAllUnitsNumbers = (url: string) => axios.get<string[]>(url);

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
    control,
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

  const onSubmit = () => {
    if (isValid) {
      let request;
      if (objectEntryId) {
        request = axios.post('/management/objects/units', { objectEntryId, number: getValues().unitNumber });
      }

      if (unitNumber && unitId) {
        request = axios.post(`/management/objects/units/${unitId}`, { number: getValues().unitNumber });
      }

      request?.then((updatedUnits) => onClose(updatedUnits));
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
        <ControlledInputMUI
          control={control}
          name="unitNumber"
          type="number"
          label="Номер"
          error={errors.unitNumber?.message as string}
        />
      </form>
    </Dialog>
  );
};
