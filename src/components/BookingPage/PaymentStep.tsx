import { YooCheckout } from '@a2seven/yoo-checkout';
import { valibotResolver } from '@hookform/resolvers/valibot';
import dayjs from 'dayjs';
import FriendsBlackIcon from 'icons/friends-black-icon.svg';
import FriendsIcon from 'icons/friends-white-icon.svg';
import OtherBlackIcon from 'icons/other-black-icon.svg';
import OtherIcon from 'icons/other-white-icon.svg';
import SearchBlackIcon from 'icons/search-black-icon.svg';
import SearchIcon from 'icons/search-white-icon.svg';
import SocialBlackIcon from 'icons/social-black-icon.svg';
import SocialIcon from 'icons/social-white-icon.svg';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import CountUp from 'react-countup';
import { Controller, useForm } from 'react-hook-form';
import {
  Issues,
  Output,
  PathItem,
  ValiError,
  boolean,
  email,
  getOutput,
  minLength,
  nullable,
  object,
  optional,
  picklist,
  string,
} from 'valibot';
import { Commodity } from '@prisma/client';
import usePrevious from 'hooks/usePrevious';
import useRouterParams from 'hooks/useRouterParams';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Transition } from '@headlessui/react';
import Button from 'ui/Button';
import Checkbox from 'ui/Checkbox';
import { Input } from 'ui/Input';
import NumberInput from 'ui/NumberInput';
import RadioButtons from 'ui/RadioButtons';
import Textarea from 'ui/Textarea';
import Tooltip from 'ui/Tooltip';
import CommodityDisclosure from './CommodityDisclosure';
import EntryTypeCalendar from './EntryTypeCalendar';
import { useBookingState } from './StateProvider';

dayjs.locale('ru');

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
};

const sourcePollItems = [
  { icon: SocialIcon, activeIcon: SocialBlackIcon, type: 'social', title: 'Социальные сети' },
  { icon: SearchIcon, activeIcon: SearchBlackIcon, type: 'search', title: 'Гугл' },
  { icon: FriendsIcon, activeIcon: FriendsBlackIcon, type: 'friends', title: 'Друзья' },
  { icon: OtherIcon, activeIcon: OtherBlackIcon, type: 'other', title: 'Другое' },
] as const;

const PaymentSchema = object(
  {
    email: string([email('Введите корректный email'), minLength(1, 'Обязательное поле')]),
    name: string([minLength(1, 'Обязательное поле')]),
    surname: string([minLength(1, 'Обязательное поле')]),
    phone: string([minLength(1, 'Обязательное поле')]),
    hasPromoCode: boolean(),
    promoCode: optional(string()),
    hasComment: boolean(),
    comment: optional(string()),
    paymentType: string(),
    organization: nullable(
      object({
        name: nullable(string()),
        ORGN: nullable(string([minLength(16)])),
        INN: nullable(string()),
        OKPO: nullable(string()),
        OKVED: nullable(string()),
        BIK: nullable(string()),
        checkingAccount: nullable(string()),
        correspondentAccount: nullable(string()),
      })
    ),
    sourcePoll: picklist(['social', 'search', 'friends', 'other']),
  },
  [
    (input) => {
      if (input.paymentType === '5' && input.organization) {
        type OrganizationKeys = (keyof typeof input.organization)[];
        const keys: OrganizationKeys = [];

        (Object.keys(input.organization) as unknown as OrganizationKeys).forEach((organizationKey) => {
          if (!input.organization![organizationKey] && organizationKey !== 'OKVED') {
            keys.push(organizationKey);
          }
        });

        if (keys.length) {
          const errors = keys.map((organizationKey) => {
            return {
              reason: 'string',
              validation: 'custom',
              origin: 'value',
              message: 'Обязательное поле',
              input: '',
              path: [
                {
                  schema: organizationKey,
                  input: input,
                  key: `organization.${organizationKey}`,
                  value: input.organization![organizationKey],
                  type: 'object',
                } as PathItem,
              ],
            };
          }) as Issues;

          throw new ValiError(errors);
        }
      }

      return getOutput(input);
    },
  ]
);

// TODO: think about move this component to pages and create a uniform interface
const PaymentStep = ({ entry, commonCommodities }: Props) => {
  //   const { trigger } = useSWRMutation('/api/bookings', (url, { arg }: { arg: CreateBookingBody }) => {
  //     return axios.post<CreateBookingBody>(url, arg);
  //   });
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    getValues,
  } = useForm<Output<typeof PaymentSchema>>({
    resolver: valibotResolver(PaymentSchema),
    defaultValues: {
      paymentType: '3',
      sourcePoll: 'other',
      hasComment: false,
      hasPromoCode: false,
      organization: null,
    },
  });

  const { bookingState, updateExtraSeats, updateServicesAmount } = useBookingState();
  const { deleteQueryParams } = useRouterParams();
  const prevBillInfoTotal = usePrevious(bookingState.total);

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => updateServicesAmount({ amount, price: commodity.price, title: commodity.title }),
    isActive: true,
    value: bookingState.services[commodity.title],
  }));

  const onSubmit = handleSubmit(async (data) => {
    // const body: BookingBody = {
    //   ...paymentInfo,
    //   sendEmail: true,
    //   start: paymentInfo.startDate?.format(),
    //   end: dayjs(paymentInfo.startDate).add(paymentInfo.nightsAmount, 'day').format(),
    //   extraSeats: paymentInfo.extraSeats,
    //   total: paymentInfo.total,
    //   client: {
    //     name,
    //     email,
    //     phone,
    //   },
    // };
    // trigger(body);

    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_SHOP_ID as string;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_API as string;
    const t = Buffer.from(`${shopId}:${secretKey}`, 'utf8').toString('base64');
    // // const booking = await createBooking(total, dayjs(), dayjs().add(1, 'd'), entryId);

    // const body = {
    //   amount: {
    //     value: '100.00',
    //     currency: 'RUB',
    //   },
    //   capture: true,
    //   confirmation: {
    //     type: 'redirect',
    //     return_url: `http://localhost:3000/payment/${13}`,
    //   },
    //   description: 'Заказ №1',
    //   metadata: { id: '123' },
    // };

    const res = await fetch('/v3/payments', {
      method: 'GET',

      headers: {
        Authorization: `Basic ${t}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': String(Math.random()),
      },
      // body: JSON.stringify(body),
    });
    // const json = (await res.json()) as {
    //   id: string;
    //   status: 'pending';
    //   amount: { value: string; currency: 'RUB' };
    //   description: string;
    //   recipient: { account_id: string; gateway_id: string };
    //   created_at: string;
    //   confirmation: {
    //     type: 'redirect';
    //     confirmation_url: string;
    //   };
    //   test?: boolean;
    //   paid: boolean;
    //   refundable: boolean;
    //   metadata: { id: '123' };
    // };
    // // await updatePaymentToken(booking.id, json.id);
    // redirect(json.confirmation.confirmation_url);

    // const checkout = new YooCheckout({ shopId, secretKey });
    // console.log(secretKey, shopId);
    // const paymentList = await checkout.getPaymentList();
  });

  useEffect(() => {
    if (!bookingState.start) {
      deleteQueryParams('isPayment');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingState.start]);

  return (
    <div className="flex gap-12 [&>*]:basis-1/3">
      <div className="flex flex-col gap-4">
        <EntryTypeCalendar entry={entry} className="h-fit border-2 border-black focus-within:border-primary" />
        <NumberInput
          className="h-fit rounded-[10px] border-2 border-black"
          placeholder="Дополнительные места"
          value={bookingState.extraSeats}
          onChange={updateExtraSeats}
          max={entry.extraSeats}
        />
        <CommodityDisclosure commodities={commoditiesDisclosure} />
      </div>
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
        <Input placeholder="Телефон" _size="xxl" {...register('phone')} error={errors?.phone?.message} />
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
          <Input _size="xxl" placeholder="Промокод" {...register('promoCode')} />
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
        <Transition
          show={watch('paymentType') === '5'}
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
      <div className="flex flex-col border-t-2 [&>*:nth-last-child(n+3)]:border-b-2">
        <span className="py-3 font-semibold">Заезд - {dayjs(bookingState.start).format('D MMMM')} c 15:00</span>
        <span className="py-3 font-semibold">Выезд - {dayjs(bookingState.end).format('D MMMM')} c 15:00</span>
        <div className="grid grid-cols-2 gap-5 py-5 text-2xl">
          <span className="font-semibold">Предоплата:</span>
          <span className="justify-self-end font-inter">
            <CountUp start={(prevBillInfoTotal ?? 0) / 2} end={bookingState.total / 2} suffix=" ₽" duration={0.5} />
          </span>
          <span className="font-semibold">Итого:</span>
          <span className="justify-self-end font-inter">
            <CountUp start={prevBillInfoTotal ?? 0} end={bookingState.total} suffix=" ₽" duration={0.5} />
          </span>
        </div>
        <div className="py-5">
          {/* <Controller name='' control={contol} render={({field: {value, onChange}}) => }/> */}
          <RadioButtons
            value=""
            items={[
              { label: 'Оплатить всю сумму', id: '1' },
              { label: 'Внести предоплату (50%)', id: '2' },
            ]}
            onChange={() => {}}
          />
        </div>
        <div className="py-5">
          <Controller
            name="paymentType"
            control={control}
            render={({ field: { value, onChange } }) => (
              <RadioButtons
                value={value}
                items={[
                  { label: 'Оплатить банковской картой', id: '3' },
                  { label: 'Оплатить кошельком YooMoney', id: '4' },
                  { label: 'Оплата для юридических лиц', id: '5' },
                ]}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-4 py-5  font-semibold">
          <span className="text-lg">Откуда вы о нас узнали?</span>
          <div className="flex gap-4">
            {sourcePollItems.map(({ icon, activeIcon, type, title }) => {
              const Icon = watch('sourcePoll') === type ? activeIcon : icon;

              return (
                <Tooltip key={type} text={title} className="text-sm">
                  <span className="cursor-pointer" onClick={() => setValue('sourcePoll', type)}>
                    <Icon />
                  </span>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <Button size="xxl" fullWidth color="primary" onClick={onSubmit}>
            Оплатить
          </Button>
          <p className="text-sm font-semibold text-tertiary">
            Бронируя данный объект, вы подтверждаете своё согласие с договором оферты.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
