import { BookingStatus } from '@prisma/client';

export const bookingStatusTranslate = {
  [BookingStatus.PendingPayment]: 'Ожидает оплаты',
  [BookingStatus.Paid]: 'Оплачено',
  [BookingStatus.Canceled]: 'Отменен',
  [BookingStatus.PendingInvoice]: 'Ожидает оплаты',
  [BookingStatus.PrePaid]: 'Оплачен наполовину',
  [BookingStatus.Closed]: 'Бронирование закрыто',
};
