'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Plus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import { z } from 'zod';
import { EntryFuturePrice, EntryHolidayPrice, ObjectEntry } from '@prisma/client';
import { DialogNames } from 'containers/StateContext';
import Field from 'components/ManagementPage/Field';
import { useStateContext } from 'hooks/useStateContext';
import axios from 'core/axios';
import { DateFormats } from 'core/enums/DateFormats';
import { formatDate } from 'core/helpers/date';
import formatToRuble from 'core/helpers/number';
import { FormHelperText } from '@mui/material';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DatePickerMUI, DateRangeMUI } from 'mui/DatePickerMUI';
import { ControlledInputMUI } from 'mui/InputMUI';
import AccordionTransition from 'ui/AccordionTransition';
import Button from 'ui/Button';
import Card from 'ui/Card';

type SectionProps = {
  objectEntry: ObjectEntry;
};

const CurrentPricesSection = ({ objectEntry }: SectionProps) => {
  const [isAddFuturePriceShown, setIsAddFuturePriceShown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { open } = useStateContext();

  const { data, isLoading, isValidating, mutate } = useSWR(
    `/management/objects/prices/future?objectEntryId=${objectEntry.id}`,
    (url: string) => axios.get<EntryFuturePrice[]>(url)
  );

  const schema = z.object({
    start: z
      .instanceof(dayjs as unknown as typeof dayjs.Dayjs)
      .nullable()
      .refine((date) => date && date.isAfter(dayjs(), 'day'), 'Ввведите дату в будущем')
      .refine((date) => !data?.some(({ start }) => dayjs(start).isSame(date, 'day')), 'Эта дата уже существует'),
    priceWeekday: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Ввведите число > 0'),
    priceWeekend: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Ввведите число > 0'),
  });

  const {
    getValues,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      start: dayjs().add(1, 'day'),
      priceWeekday: '0',
      priceWeekend: '0',
    },
  });

  const toggleCreationForm = () => {
    setIsAddFuturePriceShown(!isAddFuturePriceShown);
    reset();
  };

  const onCreateFuturePrice = async () => {
    if (isValid) {
      setIsUpdating(true);
      setIsAddFuturePriceShown(false);

      const data = await axios.post('/management/objects/prices/future', {
        ...schema.parse(getValues()),
        objectEntryId: objectEntry.id,
      });

      mutate(data, { revalidate: false });
      setIsUpdating(false);
    }
  };

  const deleteFuturePrice = (id: string) => {
    const onSubmit = async () => {
      setIsUpdating(true);
      const data = await axios.delete('/management/objects/prices/future', { data: { id } });
      mutate(data, { revalidate: false });
      setIsUpdating(false);
    };

    open(DialogNames.ConfirmationDialog, {
      onSubmit,
      submitLabel: 'Удалить',
      message: `Вы точно хотите удалить будущую цену?`,
    });
  };

  return (
    <>
      <div className="mt-2 border-t pt-1">
        <div className="grid grid-cols-[2fr,_1fr,_1fr,_36px] gap-2 items-center">
          <div className="text-gray-500 text-xs col-start-2">Будни</div>
          <div className="text-gray-500 text-xs">Выходные</div>
          <Button className="justify-self-end" isIconButton onClick={toggleCreationForm}>
            <Plus />
          </Button>
        </div>

        <div className="grid grid-cols-[2fr,_1fr,_1fr,_36px] gap-2 mb-2">
          <div>Текущие цены</div>
          <div className="text-success">{formatToRuble(objectEntry.priceWeekdays)}</div>
          <div className="col-span-2 text-success">{formatToRuble(objectEntry.priceWeekends)}</div>
        </div>

        {isLoading || isValidating || isUpdating ? (
          <div className="col-span-4">
            <Skeleton />
          </div>
        ) : (
          data?.map(({ start, priceWeekday, priceWeekend, id }) => (
            <div key={id} className="grid grid-cols-[2fr,_1fr,_1fr,_36px] gap-2 group">
              <div>C {formatDate(start, DateFormats.Date)}</div>
              <div className="text-success">{formatToRuble(priceWeekday)}</div>
              <div className="text-success">{formatToRuble(priceWeekend)}</div>
              <Button
                className="justify-self-end opacity-0 transition group-hover:opacity-100"
                isIconButton
                size="xxs"
                color="error"
                onClick={() => deleteFuturePrice(id)}
              >
                <Trash2 />
              </Button>
            </div>
          ))
        )}
      </div>

      <AccordionTransition show={isAddFuturePriceShown}>
        <form onSubmit={handleSubmit(onCreateFuturePrice)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
          <div className="mb-2">Создать будущую цену</div>
          <div className="mb-2">
            <Controller
              control={control}
              name="start"
              render={({ field: { onChange, value } }) => (
                <DatePickerMUI
                  error={!!errors.start}
                  helperText={errors.start?.message}
                  label="Начало периода"
                  onChange={onChange}
                  value={value}
                  minDate={dayjs().add(1, 'day')}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ControlledInputMUI control={control} name="priceWeekday" label="Рабочие дни" type="number" />
            <ControlledInputMUI control={control} name="priceWeekend" label="Выходные дни" type="number" />
          </div>
          <div className="flex flex-row gap-2 w-full justify-end">
            <Button onClick={() => setIsAddFuturePriceShown(false)}>Отмена</Button>
            <Button color="primary" type="submit" disabled={!isValid}>
              Создать
            </Button>
          </div>
        </form>
      </AccordionTransition>
    </>
  );
};

const HolidayPricesSection = ({ objectEntry }: SectionProps) => {
  const [isAddHolidayPriceShown, setIsAddHolidayPriceShown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const today = useRef(dayjs().startOf('day'));

  const { open } = useStateContext();

  const schema = z
    .object({
      holidaysPeriod: z.object({
        start: z
          .instanceof(dayjs as unknown as typeof dayjs.Dayjs, { message: 'Ввведите валидную дату "Конца"' })
          .nullable()
          .refine((date) => date && date.isSameOrAfter(today.current), 'Введеная дата "Начала" в прошлом'),
        end: z
          .instanceof(dayjs as unknown as typeof dayjs.Dayjs, { message: 'Ввведите валидную дату "Конца"' })
          .nullable()
          .refine((date) => date && date.isSameOrAfter(today.current), 'Введеная дата "Конца" в прошлом'),
      }),
      price: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Введите число > 0'),
    })
    .refine(({ holidaysPeriod: { start, end } }) => start && end && start.isSameOrBefore(end), {
      message: 'Начало > Конец',
      path: ['holidaysPeriod.start'],
    })
    .refine(
      ({ holidaysPeriod }) =>
        holidaysPeriod.start &&
        holidaysPeriod.end &&
        !data?.some(
          ({ start, end }: EntryHolidayPrice) =>
            holidaysPeriod.start?.isBetween(start, end, 'day', '[]') ||
            holidaysPeriod.end?.isBetween(start, end, 'day', '[]')
        ) &&
        !data?.some(
          ({ start, end }: EntryHolidayPrice) =>
            dayjs(start).isBetween(holidaysPeriod.start, holidaysPeriod.end, 'day', '[]') ||
            dayjs(end).isBetween(holidaysPeriod.start, holidaysPeriod.end, 'day', '[]')
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
      holidaysPeriod: {
        start: today.current,
        end: today.current,
      },
      price: '0',
    },
  });

  const { data, isLoading, isValidating, mutate } = useSWR(
    `/management/objects/prices/holiday?objectEntryId=${objectEntry.id}`,
    (url: string) => axios.get<EntryHolidayPrice[]>(url)
  );

  const toggleCreationForm = () => {
    setIsAddHolidayPriceShown(!isAddHolidayPriceShown);
    reset();
  };

  const onCreateFuturePrice = async () => {
    if (isValid) {
      setIsUpdating(true);
      setIsAddHolidayPriceShown(false);

      const formData = schema.parse(getValues());
      const data = await axios.post('/management/objects/prices/holiday', {
        price: formData.price,
        start: formData.holidaysPeriod.start,
        end: formData.holidaysPeriod.end,
        objectEntryId: objectEntry.id,
      });

      mutate(data, { revalidate: false });
      setIsUpdating(false);
    }
  };

  const deleteHolidayPrice = async (id: string) => {
    const onSubmit = async () => {
      setIsUpdating(true);
      const data = await axios.delete('/management/objects/prices/holiday', { data: { id } });
      mutate(data, { revalidate: false });
      setIsUpdating(false);
    };

    open(DialogNames.ConfirmationDialog, {
      onSubmit,
      submitLabel: 'Удалить',
      message: `Вы точно хотите удалить праздничную цену?`,
    });
  };

  return (
    <>
      <div className="mt-2 border-t pt-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span>Праздничные цены</span>
          <Button isIconButton onClick={toggleCreationForm}>
            <Plus />
          </Button>
        </div>

        {isLoading || isValidating || isUpdating ? (
          <Skeleton count={2} />
        ) : !data?.length ? (
          <p className="text-gray-500 text-xs">Праздничных цен нет</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr,_1fr,_1fr,_24px] gap-1">
              <div className="text-gray-500 text-xs">Начало</div>
              <div className="text-gray-500 text-xs">Конец</div>
              <div className="text-gray-500 text-xs col-span-2">Цена</div>
            </div>
            {data?.map(({ start, end, price, id }) => (
              <div key={id} className="grid grid-cols-[1fr,_1fr,_1fr,_24px] gap-1 group items-center">
                <div>{formatDate(start, DateFormats.Date)}</div>
                <div>{formatDate(end, DateFormats.Date)}</div>
                <div className="text-success">{formatToRuble(price)}</div>
                <Button
                  isIconButton
                  size="xxs"
                  color="error"
                  className="opacity-0 transition group-hover:opacity-100"
                  onClick={() => deleteHolidayPrice(id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </>
        )}
      </div>
      <AccordionTransition show={isAddHolidayPriceShown}>
        <form onSubmit={handleSubmit(onCreateFuturePrice)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
          <div className="mb-2">Создать праздничную цену</div>
          <div className="mb-2">
            <ControlledInputMUI control={control} name="price" label="Цена" type="number" />
          </div>
          <Controller
            name="holidaysPeriod"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateRangeMUI
                onChange={([start, end]: DateRange<dayjs.Dayjs>) => onChange({ start, end })}
                value={[value.start, value.end]}
                disableDates={data}
              />
            )}
          />
          <FormHelperText error>{errors.holidaysPeriod?.message}</FormHelperText>
          <FormHelperText error>{errors.holidaysPeriod?.start?.message}</FormHelperText>
          <FormHelperText error>{errors.holidaysPeriod?.end?.message}</FormHelperText>
          <div className="flex flex-row gap-2 w-full justify-end">
            <Button onClick={() => setIsAddHolidayPriceShown(false)}>Отмена</Button>
            <Button color="primary" type="submit" disabled={!isValid}>
              Создать
            </Button>
          </div>
        </form>
      </AccordionTransition>
    </>
  );
};

type Props = { objectEntry: ObjectEntry };

export default function PricesCard({ objectEntry }: Props) {
  return (
    <Card title="Стоимость">
      <div className="flex flex-col gap-1">
        <Field
          label="Предоплата"
          value={objectEntry.prepay ? <span className="text-success">{objectEntry.prepay}%</span> : 'Нет'}
          rightAlignment
        />
        <Field
          label="Доп. место"
          value={
            objectEntry.extraSeats ? (
              <span className="text-success">{formatToRuble(objectEntry.priceExtraSeat)}</span>
            ) : (
              'Нет'
            )
          }
          rightAlignment
        />
        <CurrentPricesSection objectEntry={objectEntry} />
        <HolidayPricesSection objectEntry={objectEntry} />
      </div>
    </Card>
  );
}
