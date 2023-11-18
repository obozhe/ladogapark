import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

type BookingState = {
  total: number;
  start: Date | null;
  end: Date | null;
  extraSeats: number;
  commoditiesOrderTotal: number;
  parking: number | null;
  entryId: string | null;
  unitId?: string;
  commoditiesOrder: Record<string, number>;
  nightsAmount: number;
};

export type BookingContextType = {
  bookingState: BookingState;
  setBookingState: Dispatch<SetStateAction<BookingState>>;
  updateExtraSeats: (amount: number, cost: number) => void;
  updateServicesAmount: (params: { amount: 1 | -1; price: number; id: string }) => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

const BookingStateProvider = ({ children }: { children: ReactNode }) => {
  const [bookingState, setBookingState] = useState<BookingState>(() => ({
    total: 0,
    start: null,
    end: null,
    nightsAmount: 0,
    extraSeats: 0,
    commoditiesOrderTotal: 0,
    parking: null,
    entryId: null,
    commoditiesOrder: {},
  }));

  const updateExtraSeats = (amount: number, cost: number) => {
    setBookingState((prev) => ({
      ...prev,
      extraSeats: amount,
      total: prev.total + amount * 1000 * prev.nightsAmount - prev.extraSeats * 1000 * prev.nightsAmount,
    }));
  };

  const updateServicesAmount = ({ amount, price, id }: { amount: 1 | -1; id: string; price: number }) => {
    setBookingState((prev) => {
      return {
        ...prev,
        total: prev.total + amount * price,
        commoditiesOrderTotal: prev.commoditiesOrderTotal + amount * price,
        commoditiesOrder: { ...prev.commoditiesOrder, [id]: (prev.commoditiesOrder[id] ?? 0) + amount },
      };
    });
  };

  return (
    <BookingContext.Provider value={{ bookingState, setBookingState, updateExtraSeats, updateServicesAmount }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingState = () => {
  const value = useContext(BookingContext);
  if (!value) {
    throw Error('Component is not in BookingStateProvider');
  }

  return value;
};

export default BookingStateProvider;
