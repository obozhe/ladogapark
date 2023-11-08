import dayjs from 'dayjs';
import FriendsBlackIcon from 'icons/friends-black-icon.svg';
import FriendsIcon from 'icons/friends-white-icon.svg';
import OtherBlackIcon from 'icons/other-black-icon.svg';
import OtherIcon from 'icons/other-white-icon.svg';
import SearchBlackIcon from 'icons/search-black-icon.svg';
import SearchIcon from 'icons/search-white-icon.svg';
import SocialBlackIcon from 'icons/social-black-icon.svg';
import SocialIcon from 'icons/social-white-icon.svg';
import { useEffect, useState } from 'react';
import { Commodity, Payment } from '@prisma/client';
import useRouterParams from 'hooks/useRouterParams';
import formatToRuble from 'core/helpers/number';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import { Transition } from '@headlessui/react';
import Button from 'ui/Button';
import Checkbox from 'ui/Checkbox';
import { Input } from 'ui/Input';
import NumberInput from 'ui/NumberInput';
import RadioButtons from 'ui/RadioButtons';
import Textarea from 'ui/Textarea';
import CommodityDisclosure from './CommodityDisclosure';
import EntryTypeCalendar from './EntryTypeCalendar';
import { useBookingState } from './StateProvider';

dayjs.locale('ru');

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
};
type PaymentState = {
  email: string;
  phone: string;
  name: string;
  surname: string;

  organization: {
    name: string;
    ORGN: string;
    INN: string;
    OKPO: string;
    OKVED?: string;
    BIK: string;
    checkingAccount: string;
    correspondentAccount: string;
  } | null;

  hasPromoCode: boolean;
  hasComment: boolean;

  comment?: string;
  promoCode?: string;

  sourcePoll: (typeof sourcePollItems)[number]['type'] | null;
};

const sourcePollItems = [
  { icon: SocialIcon, activeIcon: SocialBlackIcon, type: 'social' },
  { icon: SearchIcon, activeIcon: SearchBlackIcon, type: 'search' },
  { icon: FriendsIcon, activeIcon: FriendsBlackIcon, type: 'friends' },
  { icon: OtherIcon, activeIcon: OtherBlackIcon, type: 'other' },
] as const;

// TODO: think about move this component to pages and create a uniform interface
const PaymentStep = ({ entry, commonCommodities }: Props) => {
  //   const { trigger } = useSWRMutation('/api/bookings', (url, { arg }: { arg: CreateBookingBody }) => {
  //     return axios.post<CreateBookingBody>(url, arg);
  //   });
  const [paymentState, setPaymentState] = useState<PaymentState>({
    email: '',
    phone: '',
    name: '',
    surname: '',
    organization: null,
    hasComment: false,
    hasPromoCode: false,
    sourcePoll: null,
  });
  const { bookingState, updateExtraSeats, updateServicesAmount } = useBookingState();
  const { deleteQueryParams } = useRouterParams();

  const commoditiesDisclosure = [...commonCommodities, ...entry.extraCommodities].map((commodity) => ({
    name: commodity.title,
    price: commodity.price,
    max: Number.MAX_SAFE_INTEGER,
    onChange: (amount: 1 | -1) => updateServicesAmount({ amount, price: commodity.price, title: commodity.title }),
    isActive: true,
    value: bookingState.services[commodity.title],
  }));

  const onSubmit = () => {
    // // TODO: validation
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
  };

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
          <Input className="w-full" placeholder="Имя" _size="xxl" disableHelper />
          <Input className="w-full" placeholder="Фамилия" _size="xxl" disableHelper />
        </div>
        <Input placeholder="Телефон" disableHelper _size="xxl" />
        <Input
          _size="xxl"
          placeholder="E-mail"
          helper="На E-mail придёт письмо с информацией о вашем бронировании и чек об оплате. Если вы не хотите получать эти письма, поле E-mail оставьте пустым."
        />
        <Checkbox
          value={paymentState.hasPromoCode}
          text="У меня есть промокод"
          onChange={() => setPaymentState((prev) => ({ ...prev, hasPromoCode: !prev.hasPromoCode }))}
        />

        <Transition
          show={paymentState.hasPromoCode}
          appear={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Input
            _size="xxl"
            placeholder="Промокод"
            value={paymentState.promoCode ?? ''}
            onChange={(e) => setPaymentState((prev) => ({ ...prev, promoCode: e.target.value }))}
          />
        </Transition>

        <Checkbox
          value={paymentState.hasComment}
          text="Добавить примечание к заказу"
          onChange={() => setPaymentState((prev) => ({ ...prev, hasComment: !prev.hasComment }))}
        />
        <Transition
          show={paymentState.hasComment}
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
            value={paymentState.comment ?? ''}
            onChange={(e) => setPaymentState((prev) => ({ ...prev, comment: e.target.value }))}
          />
        </Transition>
      </div>
      <div className="flex flex-col border-t-2 [&>*:nth-last-child(n+3)]:border-b-2">
        <span className="py-3 font-semibold">Заезд - {dayjs(bookingState.start).format('D MMMM')} c 15:00</span>
        <span className="py-3 font-semibold">Выезд - {dayjs(bookingState.end).format('D MMMM')} c 15:00</span>
        <div className="grid grid-cols-2 gap-5 py-5 text-2xl">
          <span className="font-semibold">Предоплата:</span>
          <span className="justify-self-end font-inter">{formatToRuble(bookingState.total / 2)}</span>
          <span className="font-semibold">Итого:</span>
          <span className="justify-self-end font-inter">{formatToRuble(bookingState.total)}</span>
        </div>
        <div className="py-5">
          <RadioButtons
            items={[
              { label: 'Оплатить всю сумму', id: '1' },
              { label: 'Внести предоплату (50%)', id: '2' },
            ]}
            onChange={() => {}}
          />
        </div>
        <div className="py-5">
          <RadioButtons
            items={[
              { label: 'Оплатить банковской картой', id: '3' },
              { label: 'Оплатить кошельком YooMoney', id: '4' },
              { label: 'Оплата для юридических лиц', id: '5' },
            ]}
            onChange={() => {}}
          />
        </div>
        <div className="flex gap-4 py-5">
          {sourcePollItems.map(({ icon, activeIcon, type }) => {
            const Icon = paymentState.sourcePoll === type ? activeIcon : icon;

            return (
              <span
                className="cursor-pointer"
                key={type}
                onClick={() => setPaymentState((prev) => ({ ...prev, sourcePoll: type }))}
              >
                <Icon />
              </span>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <Button size="xxl" fullWidth color="primary">
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
