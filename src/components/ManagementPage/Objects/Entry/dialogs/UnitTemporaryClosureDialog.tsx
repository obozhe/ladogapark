'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UnitTemporaryClosure } from '@prisma/client';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import FormHelperText from '@mui/material/FormHelperText';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DatePickerMUI, StaticDateRangePickerMUI } from 'mui/DatePickerMUI';
import Dialog from 'ui/Dialog';

export const UnitTemporaryClosureDialog = () => {
  const today = useRef(dayjs().startOf('day'));

  const {
    isOpen,
    close,
    props: { onClose, unitId, unitNumber, closures },
  } = useStateContext();

  // TODO: fix refine errors not showing
  const schema = z
    .object({
      start: z
        .instanceof(dayjs as unknown as typeof Dayjs)
        .nullable()
        .refine(
          (date) => date && (date.isAfter(today.current) || date.isSame(today.current)),
          'Ввведите валидную дату "Начала" в будущем'
        ),
      end: z
        .instanceof(dayjs as unknown as typeof Dayjs)
        .nullable()
        .refine(
          (date) => date && (date.isAfter(today.current) || date.isSame(today.current)),
          'Ввведите валидную дату "Конца" в будущем'
        ),
    })
    .refine((data) => data.start?.isBefore(data.end) || !data.start?.isSame(data.end, 'day'), {
      message: 'Дата "начала" должна быть до даты "конца"',
      path: ['periodError'],
    })
    .refine(
      (formData) => {
        const isBefore = (date: Dayjs) => formData.start?.isBefore(date, 'day') && formData.end?.isBefore(date, 'day');
        const isAfter = (date: Dayjs) => formData.start?.isAfter(date, 'day') && formData.end?.isAfter(date, 'day');

        return (
          (formData.start &&
            formData.end &&
            closures?.every(({ start }: UnitTemporaryClosure) => isBefore(dayjs(start)))) ||
          closures?.every(({ end }: UnitTemporaryClosure) => isAfter(dayjs(end)))
        );
      },
      {
        message: 'Периоды не могут пересекаться',
        path: ['periodError'],
      }
    );

  const {
    getValues,
    handleSubmit,
    control,
    setValue,

    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      start: today.current,
      end: today.current,
      periodError: '',
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

  console.log(errors);
  const setFormValue = ([start, end]: DateRange<Dayjs>) => {
    console.log(start, end);
    setValue('start', start as Dayjs, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    setValue('end', end as Dayjs, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
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
      <form className=" flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <StaticDateRangePickerMUI
          label="Период закрытия"
          onChange={setFormValue}
          value={[getValues().start, getValues().end]}
        />
        <FormHelperText error>{errors.start?.message}</FormHelperText>
        <FormHelperText error>{errors.end?.message}</FormHelperText>
        <FormHelperText error>{errors.periodError?.message}</FormHelperText>
      </form>
    </Dialog>
  );
};
