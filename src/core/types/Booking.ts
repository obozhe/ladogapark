type BookingBody = {
  entryId: string;
  unitId: string;
  partnerId: string | null;
  promoCodeId: string | null;
  start: string;
  end: string;
  extraSeats: number;
  parking: number;
  //   sourcePoll: SourcePoll;
  prePay: number;
  total: number;
  comment?: string;
  sendEmail: true;

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

  client: {
    name: string;
    phone: string;
    email: string;
  };
};
