import { IconCheck, IconLoader2, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';
import { useIMask } from 'react-imask';
import useSWRMutation from 'swr/mutation';
import useDebounce from 'hooks/useDebounce';
import axios from 'core/axios';
import mergeRefs from 'core/helpers/mergeRefs';
import { Transition } from '@headlessui/react';
import Checkbox from 'ui/Checkbox';
import { Input } from 'ui/Input';
import Textarea from 'ui/Textarea';
import { TPaymentSchema } from './PaymentStep';

type Props = {
  entryId: string;
};

const ClientForm = ({ entryId }: Props) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext<TPaymentSchema>();

  const {
    trigger,
    data: promoCode,
    isMutating,
  } = useSWRMutation(
    '/promo-codes/check',
    async (url, { arg }: { arg: { code: string; start: string; entryId: string } }) => {
      const res = await axios.get<null | { discount: number; type: 'Percent' | 'Amount'; id: string }>(url, {
        params: arg,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data) {
          setValue('promoCode', data);
        }
      },
    }
  );
  const debouncedPromoCodeTrigger = useDebounce(trigger);
  const { ref: maskRef } = useIMask({ mask: '+0 (000) 000-0000' });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Input className="w-full" placeholder="Имя" _size="xxl" {...register('name')} error={errors?.name?.message} />
        <Input
          className="w-full"
          placeholder="Фамилия"
          _size="xxl"
          {...register('surname')}
          error={errors?.surname?.message}
        />
      </div>
      <Input
        className="font-inter"
        placeholder="Телефон"
        _size="xxl"
        {...register('phone')}
        error={errors?.phone?.message}
        ref={mergeRefs(maskRef, register('phone').ref)}
      />
      <Input
        _size="xxl"
        placeholder="E-mail"
        helper="На E-mail придёт письмо с информацией о вашем бронировании и чек об оплате. Если вы не хотите получать эти письма, поле E-mail оставьте пустым."
        {...register('email')}
        error={errors?.email?.message}
      />
      <Controller
        name="hasPromoCode"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox value={value} text="У меня есть промокод" onChange={() => onChange(!value)} />
        )}
      />

      <Transition
        show={watch('hasPromoCode')}
        appear={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex items-center justify-between gap-5">
          <Input
            _size="xxl"
            placeholder="Промокод"
            wrapperClassName="w-full"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                debouncedPromoCodeTrigger({ code: value, entryId, start: dayjs().toISOString() });
              }
            }}
            error={promoCode === null}
            endAdornment={
              (promoCode !== undefined || isMutating) &&
              (isMutating ? (
                <IconLoader2 className="animate-spin" />
              ) : promoCode ? (
                <IconCheck color="green" />
              ) : (
                <IconX color="red" />
              ))
            }
          />
        </div>
      </Transition>

      <Controller
        name="hasComment"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox value={value} text="Добавить примечание к заказу" onChange={() => onChange(!value)} />
        )}
      />
      <Transition
        show={watch('hasComment')}
        appear={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Textarea
          helper="Мы постараемся сделать всё возможное, но не можем гарантировать выполнение всех пожеланий."
          placeholder="Примечание"
          {...register('comment')}
        />
      </Transition>
      <Controller
        name="isJuridical"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox value={value} text="Заказ для юридических лиц" onChange={() => onChange(!value)} />
        )}
      />
      <Transition
        show={watch('isJuridical')}
        appear={true}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Input
          placeholder="Наименование организации"
          {...register('organization.name')}
          error={errors.organization?.name?.message}
        />
        <Input placeholder="ОРГН" {...register('organization.ORGN')} error={errors.organization?.ORGN?.message} />
        <Input placeholder="ИНН" {...register('organization.INN')} error={errors.organization?.INN?.message} />
        <Input placeholder="ОКПО" {...register('organization.OKPO')} error={errors.organization?.OKPO?.message} />
        <Input
          placeholder="ОКВЭД (не обязательно)"
          {...register('organization.OKVED')}
          error={errors.organization?.OKVED?.message}
        />
        <Input placeholder="БИК" {...register('organization.BIK')} error={errors.organization?.BIK?.message} />
        <Input
          placeholder="Расчетный счет"
          {...register('organization.checkingAccount')}
          error={errors.organization?.checkingAccount?.message}
        />
        <Input
          placeholder="Корр. счет"
          {...register('organization.correspondentAccount')}
          error={errors.organization?.correspondentAccount?.message}
        />
      </Transition>
    </div>
  );
};

export default ClientForm;
