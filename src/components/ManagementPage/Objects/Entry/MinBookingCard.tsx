'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import { z } from 'zod';
import { EntryBookingLimitation, ObjectEntry } from '@prisma/client';
import { DialogNames } from 'containers/StateContext';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import { DateFormats } from 'core/enums/DateFormats';
import { formatDate } from 'core/helpers/date';
import { FormHelperText } from '@mui/material';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangeMUI } from 'mui/DatePickerMUI';
import { ControlledInputMUI } from 'mui/InputMUI';
import AccordionTransition from 'ui/AccordionTransition';
import Button from 'ui/Button';
import Card from 'ui/Card';

type Props = { objectEntry: ObjectEntry };

export default function MinBookingCard({ objectEntry }: Props) {
  const [isAddLimitationShown, setIsAddLimitationPriceShown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const today = useRef(dayjs().startOf('day'));

  const { open } = useStateContext();

  const { data, isLoading, isValidating, mutate } = useSWR(
    `/management/objects/booking-limitations?objectEntryId=${objectEntry.id}`,
    (url: string) => axios.get<EntryBookingLimitation[]>(url)
  );

  const schema = z
    .object({
      limitationPeriod: z.object({
        start: z
          .instanceof(dayjs as unknown as typeof dayjs.Dayjs, { message: 'Ввведите валидную дату "Конца"' })
          .nullable()
          .refine((date) => date && date.isSameOrAfter(today.current), 'Введеная дата "Начала" в прошлом'),
        end: z
          .instanceof(dayjs as unknown as typeof dayjs.Dayjs, { message: 'Ввведите валидную дату "Конца"' })
          .nullable()
          .refine((date) => date && date.isSameOrAfter(today.current), 'Введеная дата "Конца" в прошлом'),
      }),
      minDays: z.coerce
        .number({ required_error: 'Объязательное поле' })
        .positive('Введите число > 0')
        .int('Введите целое число'),
    })
    .refine(({ limitationPeriod: { start, end } }) => start && end && start.isSameOrBefore(end), {
      message: 'Начало > Конец',
      path: ['holidaysPeriod.start'],
    })
    .refine(
      ({ limitationPeriod }) =>
        limitationPeriod.start &&
        limitationPeriod.end &&
        !data?.some(
          ({ start, end }: EntryBookingLimitation) =>
            limitationPeriod.start?.isBetween(start, end, 'day', '[]') ||
            limitationPeriod.end?.isBetween(start, end, 'day', '[]')
        ) &&
        !data?.some(
          ({ start, end }: EntryBookingLimitation) =>
            dayjs(start).isBetween(limitationPeriod.start, limitationPeriod.end, 'day', '[]') ||
            dayjs(end).isBetween(limitationPeriod.start, limitationPeriod.end, 'day', '[]')
        ),
      {
        message: 'Периоды не должны пересекаться',
        path: ['holidaysPeriod'],
      }
    );

  const {
    reset,
    getValues,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      limitationPeriod: {
        start: today.current,
        end: today.current,
      },
      minDays: '0',
    },
  });

  const toggleCreationForm = () => {
    setIsAddLimitationPriceShown(!isAddLimitationShown);
    reset();
  };

  const onCreateFuturePrice = async () => {
    if (isValid) {
      setIsUpdating(true);
      setIsAddLimitationPriceShown(false);

      const formData = schema.parse(getValues());
      const data = await axios.post('/management/objects/booking-limitations', {
        minDays: formData.minDays,
        start: formData.limitationPeriod.start,
        end: formData.limitationPeriod.end,
        objectEntryId: objectEntry.id,
      });

      mutate(data, { revalidate: false });
      setIsUpdating(false);
    }
  };

  const deleteBookingLimitation = async (id: string) => {
    const onSubmit = async () => {
      setIsUpdating(true);
      const data = await axios.delete('/management/objects/booking-limitations', { data: { id } });
      mutate(data, { revalidate: false });
      setIsUpdating(false);
    };

    open(DialogNames.ConfirmationDialog, {
      onSubmit,
      submitLabel: 'Удалить',
      message: `Вы точно хотите удалить ограничение бронирования?`,
    });
  };

  return (
    <Card
      title="Ограничения бронирований"
      titleComponent={
        <Button isIconButton color="primary" size="xs" onClick={toggleCreationForm}>
          <Plus />
        </Button>
      }
    >
      <div className="flex flex-col gap-1">
        {isLoading || isValidating || isUpdating ? (
          <Skeleton count={1} />
        ) : !data?.length ? (
          <p className="text-gray-500 text-xs">Ограничений нет</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr,_1fr,_1fr,_24px] gap-1 items-center">
              <div className="text-gray-500 text-xs">Начало</div>
              <div className="text-gray-500 text-xs">Конец</div>
              <div className="text-gray-500 text-xs col-span-2">Минимум дней</div>
            </div>
            {data?.map(({ start, end, minDays, id }) => (
              <div key={id} className="grid grid-cols-[1fr,_1fr,_1fr,_24px] gap-1 group items-center">
                <div>{formatDate(start, DateFormats.Date)}</div>
                <div>{formatDate(end, DateFormats.Date)}</div>
                <div>{minDays}</div>
                <Button
                  isIconButton
                  size="xxs"
                  color="error"
                  className="opacity-0 transition group-hover:opacity-100"
                  onClick={() => deleteBookingLimitation(id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </>
        )}
        <AccordionTransition show={isAddLimitationShown}>
          <form onSubmit={handleSubmit(onCreateFuturePrice)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
            <div className="mb-2">Создать ограничение бронирования</div>
            <div className="mb-2">
              <ControlledInputMUI control={control} name="minDays" label="Минимум дней" type="number" />
            </div>
            <Controller
              name="limitationPeriod"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DateRangeMUI
                  onChange={([start, end]: DateRange<dayjs.Dayjs>) => onChange({ start, end })}
                  value={[value.start, value.end]}
                  disableDates={data}
                />
              )}
            />
            <FormHelperText error>{errors.limitationPeriod?.message}</FormHelperText>
            <FormHelperText error>{errors.limitationPeriod?.start?.message}</FormHelperText>
            <FormHelperText error>{errors.limitationPeriod?.end?.message}</FormHelperText>
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button onClick={() => setIsAddLimitationPriceShown(false)}>Отмена</Button>
              <Button color="primary" type="submit" disabled={!isValid}>
                Создать
              </Button>
            </div>
          </form>
        </AccordionTransition>
      </div>
    </Card>
  );
}
