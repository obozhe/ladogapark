import { SourcePoll } from '@prisma/client';

export type CreateBookingBody = {
  unitId: string;
  entryId: string;

  promoCodeId?: string;
  start: string;
  end: string;
  extraSeats: number;
  parking: number;
  sourcePoll: SourcePoll;
  prePay: number;
  total: number;
  comment?: string;

  commoditiesOrder: { id: string; count: number }[];
  commoditiesOrderTotal: number;

  organization?: {
    name: string;
    ORGN: string;
    INN: string;
    OKPO: string;
    OKVED?: string;
    BIK: string;
    checkingAccount: string;
    correspondentAccount: string;
  };

  client: {
    name: string;
    phone: string;
    email: string;
  };
};

type StateByDay = [
  string,
  {
    bookings: { isStartingDate: boolean; isEndingDate: boolean; date: string }[];
    isUnitClosed: boolean;
    freeHours: number[];
  },
];

export type ObjectBusyness = [{ id: string; status: string }, StateByDay[]][];
