'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import { z } from 'zod';
import { EntryBookingLimitation, EntryDiscountByDays, ObjectEntry } from '@prisma/client';
import { DialogNames } from 'containers/StateContext';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import { DateFormats } from 'core/enums/DateFormats';
import { formatDate } from 'core/helpers/date';
import { FormHelperText } from '@mui/material';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangeMUI } from 'mui/DatePicker';
import { ControlledInputMUI } from 'mui/Input';
import AccordionTransition from 'ui/AccordionTransition';
import Button from 'ui/Button';
import Card from 'ui/Card';

type Props = { objectEntryId: string };

export default function DiscountsByDaysCountCard({ objectEntryId }: Props) {
  const [isAddDiscountShown, setIsAddDiscountShown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const today = useRef(dayjs().startOf('day'));

  const { open } = useStateContext();

  const { data, isLoading, isValidating, mutate } = useSWR(
    `/management/objects/discounts-by-days?objectEntryId=${objectEntryId}`,
    (url: string) => axios.get<EntryDiscountByDays[]>(url)
  );

  const schema = z
    .object({
      discountPeriod: z.object({
        start: z
          .instanceof(dayjs as unknown as typeof dayjs.Dayjs, { message: 'Ввведите валидную дату "Конца"' })
          .nullable()
          .refine((date) => date && date.isSameOrAfter(today.current), 'Введеная дата "Начала" в прошлом'),
        end: z
          .instanceof(dayjs as unknown as typeof dayjs.Dayjs, { message: 'Ввведите валидную дату "Конца"' })
          .nullable()
          .refine((date) => date && date.isSameOrAfter(today.current), 'Введеная дата "Конца" в прошлом'),
      }),
      daysCount: z.coerce
        .number({ required_error: 'Объязательное поле' })
        .positive('Введите число > 0')
        .int('Введите целое число'),
      discount: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Введите число > 0').max(100),
    })
    .refine(({ discountPeriod: { start, end } }) => start && end && start.isSameOrBefore(end), {
      message: 'Начало > Конец',
      path: ['holidaysPeriod.start'],
    })
    .refine(
      ({ discountPeriod }) =>
        discountPeriod.start &&
        discountPeriod.end &&
        !data?.some(
          ({ start, end }: EntryDiscountByDays) =>
            discountPeriod.start?.isBetween(start, end, 'day', '[]') ||
            discountPeriod.end?.isBetween(start, end, 'day', '[]')
        ) &&
        !data?.some(
          ({ start, end }: EntryDiscountByDays) =>
            dayjs(start).isBetween(discountPeriod.start, discountPeriod.end, 'day', '[]') ||
            dayjs(end).isBetween(discountPeriod.start, discountPeriod.end, 'day', '[]')
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
      discountPeriod: {
        start: today.current,
        end: today.current,
      },
      daysCount: '0',
      discount: '0',
    },
  });

  const toggleCreationForm = () => {
    setIsAddDiscountShown(!isAddDiscountShown);
    reset();
  };

  const onCreateDiscount = async () => {
    if (isValid) {
      setIsUpdating(true);
      setIsAddDiscountShown(false);

      const formData = schema.parse(getValues());
      const data = await axios.post('/management/objects/discounts-by-days', {
        daysCount: formData.daysCount,
        discount: formData.discount,
        start: formData.discountPeriod.start,
        end: formData.discountPeriod.end,
        objectEntryId,
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
      message: `Вы точно хотите удалить скидку при бронировании?`,
    });
  };

  return (
    <Card
      title="Скидка при бронировании на число дней"
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
          <p className="text-gray-500 text-xs">Скидок нет</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr,_1fr,_40px,_40px,_24px] gap-2 items-center">
              <div className="text-gray-500 text-xs">Начало</div>
              <div className="text-gray-500 text-xs">Конец</div>
              <div className="text-gray-500 text-xs">Дней</div>
              <div className="text-gray-500 text-xs col-span-2">Скидка</div>
            </div>
            {data?.map(({ start, end, daysCount, discount, id }) => (
              <div key={id} className="grid grid-cols-[1fr,_1fr,_40px,_40px,_24px] gap-2 group items-center">
                <div>{formatDate(start, DateFormats.Date)}</div>
                <div>{formatDate(end, DateFormats.Date)}</div>
                <div>{daysCount}</div>
                <div>{discount}%</div>

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
        <AccordionTransition show={isAddDiscountShown}>
          <form onSubmit={handleSubmit(onCreateDiscount)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
            <div className="mb-2">Создать скидку при бронировании</div>
            <div className="grid grid-cols-2 mb-2 gap-1">
              <ControlledInputMUI control={control} name="daysCount" label="Дней" type="number" />
              <ControlledInputMUI control={control} name="discount" label="Скидка" type="number" />
            </div>
            <Controller
              name="discountPeriod"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DateRangeMUI
                  onChange={([start, end]: DateRange<dayjs.Dayjs>) => onChange({ start, end })}
                  value={[value.start, value.end]}
                  disableDates={data}
                />
              )}
            />
            <FormHelperText error>{errors.discountPeriod?.message}</FormHelperText>
            <FormHelperText error>{errors.discountPeriod?.start?.message}</FormHelperText>
            <FormHelperText error>{errors.discountPeriod?.end?.message}</FormHelperText>
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button onClick={() => setIsAddDiscountShown(false)}>Отмена</Button>
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
