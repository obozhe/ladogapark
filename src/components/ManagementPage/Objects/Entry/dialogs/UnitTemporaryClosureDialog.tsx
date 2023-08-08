'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { UnitTemporaryClosure } from '@prisma/client';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import FormHelperText from '@mui/material/FormHelperText';
import { DateRange } from '@mui/x-date-pickers-pro';
import { StaticDateRangePickerMUI } from 'mui/DatePicker';
import Dialog from 'ui/Dialog';

export const UnitTemporaryClosureDialog = () => {
  const today = useRef(dayjs().startOf('day'));

  const {
    isOpen,
    close,
    props: { onClose, unitId, unitNumber, closures },
  } = useStateContext();

  const schema = z
    .object({
      closurePeriod: z.object({
        start: z
          .instanceof(dayjs as unknown as typeof Dayjs, { message: 'Ввведите валидную дату "Конца" в будущем' })
          .refine((date) => date && date.isSameOrAfter(today.current), 'Ввведите валидную дату "Начала" в будущем'),
        end: z
          .instanceof(dayjs as unknown as typeof Dayjs, { message: 'Ввведите валидную дату "Конца" в будущем' })
          .refine(
            (date) => date && (date.isAfter(today.current) || date.isSame(today.current)),
            'Ввведите валидную дату "Конца" в будущем'
          ),
      }),
    })
    .refine(
      ({ closurePeriod: { start, end } }) => {
        return start?.isSameOrBefore(end);
      },
      {
        message: 'Дата "начала" должна быть до даты "конца"',
        path: ['closurePeriod.start'],
      }
    )
    .refine(
      ({ closurePeriod }) => {
        return (
          closurePeriod.start &&
          closurePeriod.end &&
          !closures?.some(
            ({ start, end }: UnitTemporaryClosure) =>
              closurePeriod.start?.isBetween(start, end, 'day', '[]') ||
              closurePeriod.end?.isBetween(start, end, 'day', '[]')
          ) &&
          !closures?.some(
            ({ start, end }: UnitTemporaryClosure) =>
              dayjs(start).isBetween(closurePeriod.start, closurePeriod.end, 'day', '[]') ||
              dayjs(end).isBetween(closurePeriod.start, closurePeriod.end, 'day', '[]')
          )
        );
      },
      {
        message: 'Периоды не могут пересекаться',
        path: ['closurePeriod'],
      }
    );

  const {
    getValues,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      closurePeriod: {
        start: today.current,
        end: today.current,
      },
    },
  });

  const onSubmit = () => {
    if (isValid) {
      const formData = schema.parse(getValues());

      axios
        .post('/management/objects/units/temporary-closure', { ...formData.closurePeriod, unitId })
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
      <form className=" flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="closurePeriod"
          control={control}
          render={({ field: { onChange, value } }) => (
            <StaticDateRangePickerMUI
              label="Период закрытия"
              onChange={([start, end]: DateRange<Dayjs>) => onChange({ start, end })}
              value={[value.start, value.end]}
              disableDates={closures}
            />
          )}
        />
        <FormHelperText error>{errors.closurePeriod?.message}</FormHelperText>
        <FormHelperText error>{errors.closurePeriod?.start?.message}</FormHelperText>
        <FormHelperText error>{errors.closurePeriod?.end?.message}</FormHelperText>
      </form>
    </Dialog>
  );
};
