import { ObjectEntry } from '@prisma/client';
import formatToRuble from 'core/helpers/formatNumbers';
import Disclosure from 'components/shared/Disclosure';

type InfoProps = {
  objectEntry: ObjectEntry;
};

const Bill = ({ objectEntry }: InfoProps) => {
  return (
    <section className="[&>*:not(:last-child)]:border-b-2 border-tertiary">
      <div className="grid grid-rows-[max-content_max-content] pb-2 grid-cols-[max-content_max-content] gap-2">
        {[objectEntry.priceWeekdays, objectEntry.priceWeekends].map((amount, index) => (
          <span key={amount + index} className="font-semibold text-3xl font-inter">
            {formatToRuble(amount)}
            {index === 0 && ' /'}
          </span>
        ))}
        {['Пн - Чт', 'Пт - Вс'].map((weekDays, index) => (
          <span className="font-semibold text-xs text-tertiary" key={weekDays + index}>
            {weekDays}
          </span>
        ))}
      </div>
      <div>
        <Disclosure title={<span className="text-primary">Дополнительные товары</span>} description={<div>test</div>} />
      </div>
    </section>
  );
};

export default Bill;
