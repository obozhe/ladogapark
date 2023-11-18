import { valibotResolver } from '@hookform/resolvers/valibot';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
  number,
  object,
  optional,
  picklist,
  string,
} from 'valibot';
import { Commodity } from '@prisma/client';
import useRouterParams from 'hooks/useRouterParams';
import { CreateBookingBody } from 'core/types/Booking';
import { EntryWithFuturePricesWithGroupWithServices } from 'core/types/Prisma';
import BookingForm from './BookingForm';
import CheckForm from './CheckForm';
import ClientForm from './ClientForm';

dayjs.locale('ru');

type Props = {
  entry: EntryWithFuturePricesWithGroupWithServices;
  commonCommodities: Commodity[];
  onSubmit: (bookingBody: CreateBookingBody) => Promise<
    | {
        number: string;
        token: string;
      }
    | undefined
  >;
};

const PaymentSchema = object(
  {
    email: string([email('Введите корректный email'), minLength(1, 'Обязательное поле')]),
    name: string([minLength(1, 'Обязательное поле')]),
    surname: string([minLength(1, 'Обязательное поле')]),
    phone: string([minLength(17, 'Обязательное поле')]),
    hasPromoCode: boolean(),
    promoCode: optional(object({ type: picklist(['Percent', 'Amount']), discount: number(), id: string() })),
    hasComment: boolean(),
    comment: optional(string()),
    isJuridical: boolean(),
    organization: nullable(
      object({
        name: nullable(string()),
        ORGN: nullable(string()),
        INN: nullable(string()),
        OKPO: nullable(string()),
        OKVED: nullable(string()),
        BIK: nullable(string()),
        checkingAccount: nullable(string()),
        correspondentAccount: nullable(string()),
      })
    ),
    sourcePoll: picklist(['SocialNetwork', 'SearchEngines', 'Friends', 'Other']),
  },
  [
    (input) => {
      if (input.isJuridical && input.organization) {
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
export type TPaymentSchema = Output<typeof PaymentSchema>;

// TODO: think about move this component to pages and create a uniform interface
const PaymentStep = ({ entry, commonCommodities, onSubmit }: Props) => {
  const formMethods = useForm<TPaymentSchema>({
    resolver: valibotResolver(PaymentSchema),
    defaultValues: {
      sourcePoll: 'Other',
      isJuridical: false,
      hasComment: false,
      hasPromoCode: false,
      organization: null,
    },
  });
  const { deleteQueryParams } = useRouterParams();

  // useEffect(() => {
  //   if (!bookingState.start) {
  //     deleteQueryParams('isPayment');
  //     return;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bookingState.start]);

  return (
    <div className="flex gap-12 [&>*]:basis-1/3">
      <BookingForm entry={entry} commonCommodities={commonCommodities} />
      <FormProvider {...formMethods}>
        <ClientForm entryId={entry.id} />
        <CheckForm onSubmit={onSubmit} entry={entry} />
      </FormProvider>
    </div>
  );
};

export default PaymentStep;
