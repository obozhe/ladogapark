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
import { AutoCompleteMUI } from 'mui/Autocomplete';
import { DateRangeMUI } from 'mui/DatePicker';
import { ControlledInputMUI } from 'mui/Input';
import AccordionTransition from 'ui/AccordionTransition';
import Button from 'ui/Button';
import Card from 'ui/Card';

type Props = { objectEntryId: string };

export default function PromoCodesCard({ objectEntryId }: Props) {
  const [isAddPromoCodeShown, setIsAddPromoCodeShown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { open } = useStateContext();

  const { data, isLoading, isValidating, mutate } = useSWR(
    `/management/objects/promocodes-by-booking?objectEntryId=${objectEntryId}`,
    (url: string) => axios.get<EntryDiscountByDays[]>(url)
  );

  const { data: entriesNames, isLoading: isLoadingNames } = useSWR(`/management/objects/entries/names`, (url: string) =>
    axios.get<{ id: string; title: string }[]>(url)
  );

  const schema = z.object({
    objectEntries: z
      .array(
        z.object({
          id: z.string(),
          value: z.string(),
        })
      )
      .min(1, 'Объязательное поле'),
  });

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
      objectEntries: [],
    },
  });

  const toggleCreationForm = () => {
    setIsAddPromoCodeShown(!isAddPromoCodeShown);
    reset();
  };

  const onCreatePromoCode = async () => {
    // if (isValid) {
    //   setIsUpdating(true);
    //   setIsAddPromoCodeShown(false);
    //   const formData = schema.parse(getValues());
    //   const data = await axios.post('/management/objects/discounts-by-days', {
    //     daysCount: formData.daysCount,
    //     discount: formData.discount,
    //     start: formData.discountPeriod.start,
    //     end: formData.discountPeriod.end,
    //     objectEntryId,
    //   });
    //   mutate(data, { revalidate: false });
    //   setIsUpdating(false);
    // }
  };

  // const deleteBookingLimitation = async (id: string) => {
  //   const onSubmit = async () => {
  //     setIsUpdating(true);
  //     const data = await axios.delete('/management/objects/booking-limitations', { data: { id } });
  //     mutate(data, { revalidate: false });
  //     setIsUpdating(false);
  //   };

  //   open(DialogNames.ConfirmationDialog, {
  //     onSubmit,
  //     submitLabel: 'Удалить',
  //     message: `Вы точно хотите удалить скидку при бронировании?`,
  //   });
  // };

  return (
    <Card
      title="Промокоды при бронировании"
      titleComponent={
        <Button isIconButton color="primary" size="xs" onClick={toggleCreationForm}>
          <Plus />
        </Button>
      }
    >
      <div className="flex flex-col gap-1">
        {isLoading || isValidating || isUpdating || isLoadingNames ? (
          <Skeleton count={1} />
        ) : !data?.length ? (
          <p className="text-gray-500 text-xs">Промокодов нет</p>
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
                  // onClick={() => deleteBookingLimitation(id)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </>
        )}
        <AccordionTransition show={isAddPromoCodeShown}>
          <form onSubmit={handleSubmit(onCreatePromoCode)} className="bg-gray-100 rounded p-4 flex flex-col gap-2">
            <div className="mb-2">Создать промокод</div>
            {/* <ControlledMultipleSelectMUI
              control={control}
              name="objectEntries"
              label="test"
              options={entriesNames?.map(({ id, title }) => ({ id, value: title })) || []}
            /> */}
            <Controller
              name="objectEntries"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <AutoCompleteMUI
                  label="Объекты"
                  options={entriesNames?.map(({ id, title }) => ({ id, value: title })) || []}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
            {/* <div className="grid grid-cols-2 mb-2 gap-1">
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
            /> */}
            {/* <FormHelperText error>{errors.discountPeriod?.message}</FormHelperText>
            <FormHelperText error>{errors.discountPeriod?.start?.message}</FormHelperText>
            <FormHelperText error>{errors.discountPeriod?.end?.message}</FormHelperText> */}
            <div className="flex flex-row gap-2 w-full justify-end">
              <Button onClick={() => setIsAddPromoCodeShown(false)}>Отмена</Button>
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
