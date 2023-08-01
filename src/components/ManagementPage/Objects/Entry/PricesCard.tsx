'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ObjectEntry } from '@prisma/client';
import Field from 'components/ManagementPage/Field';
import axios from 'core/axios';
import formatToRuble from 'core/helpers/number';
import AccordionTransition from 'ui/AccordionTransition';
import Button from 'ui/Button';
import Card from 'ui/Card';
import { DatePickerMUI } from 'ui/DatePicker';
import { ControlledInputMUI } from 'ui/Input';

type SectionProps = {
  objectEntry: ObjectEntry;
};

const CurrentPricesSection = ({ objectEntry }: SectionProps) => {
  const [isAddFuturePriceShown, setIsAddFuturePriceShown] = useState(false);

  const schema = z.object({
    start: z
      .instanceof(dayjs as unknown as typeof dayjs.Dayjs)
      .nullable()
      .refine((date) => date && date.isAfter(dayjs(), 'day'), 'Ввведите дату в будущем'),
    priceWeekday: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Ввведите число > 0'),
    priceWeekend: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Ввведите число > 0'),
  });

  const {
    getValues,
    handleSubmit,
    control,
    setValue,
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

  const onCreateFuturePrice = () => {
    if (isValid) {
      axios.post('/management/objects/prices/future', { ...schema.parse(getValues()), objectEntryId: objectEntry.id });
      setIsAddFuturePriceShown(false);
    }
  };

  return (
    <>
      <div className="mt-2 border-t pt-1 grid grid-cols-[2fr,_1fr,_1fr,_36px] items-center gap-2">
        <div></div>
        <div className="text-gray-500">Будни</div>
        <div className="text-gray-500">Выходные</div>
        <Button className="justify-self-end" isIconButton onClick={toggleCreationForm}>
          <Plus />
        </Button>
        <div>Текущие цены</div>
        <div>{formatToRuble(objectEntry.priceWeekdays)}</div>
        <div className="col-span-2">{formatToRuble(objectEntry.priceWeekends)}</div>
      </div>
      <AccordionTransition show={isAddFuturePriceShown}>
        <form onSubmit={handleSubmit(onCreateFuturePrice)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
          <div className="mb-2">Создать будущую цену</div>
          <div className="mb-2">
            <DatePickerMUI
              error={errors.start?.message}
              minDate={dayjs().add(1, 'day')}
              label="Начало периода"
              onChange={(value) =>
                setValue('start', value as dayjs.Dayjs, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              value={getValues().start}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ControlledInputMUI control={control} name="priceWeekday" label="Рабочие дни" type="number" />
            <ControlledInputMUI control={control} name="priceWeekend" label="Выходные дни" type="number" />
          </div>
          <div className="flex flex-row gap-2 w-full justify-end">
            <Button onClick={() => setIsAddFuturePriceShown(false)}>Отмена</Button>
            <Button color="primary" type="submit">
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

  const schema = z
    .object({
      start: z
        .instanceof(dayjs as unknown as typeof dayjs.Dayjs)
        .nullable()
        .refine((date) => date && date.isAfter(dayjs()), 'Ввведите дату в будущем'),
      end: z
        .instanceof(dayjs as unknown as typeof dayjs.Dayjs)
        .nullable()
        .refine((date) => date && date.isAfter(dayjs()), 'Ввведите дату в будущем'),
      price: z.coerce.number({ required_error: 'Объязательное поле' }).positive('Ожидается число > 0'),
    })
    .refine((data) => data.start && data.end && data.start.isBefore(data.end), {
      message: 'начало > конец',
      path: ['end'],
    });

  const {
    reset,
    getValues,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      start: dayjs(),
      end: dayjs(),
      price: '0',
    },
  });

  const toggleCreationForm = () => {
    setIsAddHolidayPriceShown(!isAddHolidayPriceShown);
    reset();
  };

  const onCreateFuturePrice = () => {
    if (isValid) {
      axios.post('/management/objects/prices/holiday', { ...schema.parse(getValues()), objectEntryId: objectEntry.id });
      setIsAddHolidayPriceShown(false);
    }
  };

  return (
    <>
      <div className="mt-2 font-semibold flex items-center justify-between border-t pt-1">
        Праздничные цены
        <Button isIconButton onClick={toggleCreationForm}>
          <Plus />
        </Button>
      </div>
      <AccordionTransition show={isAddHolidayPriceShown}>
        <form onSubmit={handleSubmit(onCreateFuturePrice)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
          <div className="mb-2">Создать праздничную цену</div>
          <div className="mb-2">
            <ControlledInputMUI control={control} name="price" label="Цена" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DatePickerMUI
              error={errors.start?.message}
              label="Начало"
              onChange={(value) =>
                setValue('start', value as dayjs.Dayjs, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              value={getValues().start}
            />
            <DatePickerMUI
              minDate={getValues().start}
              error={errors.end?.message}
              label="Конец"
              onChange={(value) =>
                setValue('end', value as dayjs.Dayjs, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              value={getValues().end}
            />
          </div>
          <div className="flex flex-row gap-2 w-full justify-end">
            <Button onClick={() => setIsAddHolidayPriceShown(false)}>Отмена</Button>
            <Button color="primary" type="submit">
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
        <Field label="Предоплата" value={objectEntry.prepay ? objectEntry.prepay + '%' : 'Нет'} rightAlignment />
        <Field
          label="Доп. место"
          value={objectEntry.extraSeats ? formatToRuble(objectEntry.priceExtraSeat) : 'Нет'}
          rightAlignment
        />
        <CurrentPricesSection objectEntry={objectEntry} />
        <HolidayPricesSection objectEntry={objectEntry} />
      </div>
    </Card>
  );
}
