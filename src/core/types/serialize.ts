export type SerializedDates<T, U extends string> = Omit<T, U> & {
  [key in U]: string;
};
