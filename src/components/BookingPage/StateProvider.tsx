import { Dayjs } from 'dayjs';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

type BookingState = {
  total: number;
  startDate: Dayjs | null;
  nightsAmount: number;
  extraSeats: number;
  extraServicesTotal: number;
  parking: number | null;
  entryId: string | null;
  unitId: string | null;
};

export type BookingContextType = {
  bookingState: BookingState;
  setBookingState: Dispatch<SetStateAction<BookingState>>;
};

const BookingContext = createContext<BookingContextType | null>(null);

const BookingStateProvider = ({ children }: { children: ReactNode }) => {
  const [bookingState, setBookingState] = useState<BookingState>(() => ({
    total: 0,
    startDate: null,
    nightsAmount: 0,
    extraSeats: 0,
    extraServicesTotal: 0,
    parking: null,
    entryId: null,
    unitId: null,
  }));

  return <BookingContext.Provider value={{ bookingState, setBookingState }}>{children}</BookingContext.Provider>;
};

export const useBookingState = () => {
  const value = useContext(BookingContext);
  if (!value) {
    throw Error('123');
  }

  return value;
};

export default BookingStateProvider;
