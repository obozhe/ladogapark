'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import DateSelects from 'ui/DateSelects';
import Dialog from 'ui/Dialog';

export const UnitTemporaryClosureDialog = () => {
  const {
    isOpen,
    close,
    props: { onClose, unitId, unitNumber },
  } = useStateContext();

  const schema = z
    .object({
      start: z.instanceof(dayjs as unknown as typeof Dayjs),
      end: z.instanceof(dayjs as unknown as typeof Dayjs),
    })
    .refine((data) => data.start.isBefore(data.end), {
      message: 'Дата "начала" должна быть до даты "конца"',
      path: ['end'],
    });

  const {
    getValues,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      start: dayjs(),
      end: dayjs(),
    },
  });

  const onSubmit = () => {
    if (isValid) {
      axios
        .post('/management/objects/units/temporary-closure', { ...getValues(), unitId })
        .then((data) => onClose(data));

      close();
    }
  };

  return (
    <Dialog
      title={`Временно закрыть юнит "${unitNumber}"`}
      isOpen={isOpen}
      onClose={close}
      onSubmit={onSubmit}
      submitLabel="Сохранить"
      disabled={!isValid}
    >
      <form className="w-96 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="start"
          render={({ field: { onChange, value } }) => <DateSelects onChange={onChange} value={value} />}
        />
        <Controller
          control={control}
          name="end"
          render={({ field: { onChange, value } }) => <DateSelects onChange={onChange} value={value} />}
        />
        <div className="text-error h-5">{errors.end?.message}</div>
      </form>
    </Dialog>
  );
};
