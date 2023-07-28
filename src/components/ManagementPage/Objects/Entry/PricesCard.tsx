'use client';

import { Plus } from 'lucide-react';
import { Fragment, useState } from 'react';
import { ObjectEntry } from '@prisma/client';
import Field from 'components/ManagementPage/Field';
import formatToRuble from 'core/helpers/number';
import { Transition } from '@headlessui/react';
import AccordionTransition from 'ui/AccordionTransition';
import Button from 'ui/Button';
import Card from 'ui/Card';
import Input from 'ui/Input';
import Select from 'ui/Select';

type Props = { objectEntry: ObjectEntry };

export default function PricesCard({ objectEntry }: Props) {
  const [isAddFuturePriceShown, setIsAddFuturePriceShown] = useState(false);
  const [isAddHolidayPriceShown, setIsAddHolidayPriceShown] = useState(false);

  return (
    <Card title="Стоимость">
      <div className="flex flex-col gap-1">
        <Field label="Предоплата" value={objectEntry.prepay ? objectEntry.prepay + '%' : 'Нет'} rightAlignment />
        <Field
          label="Доп. место"
          value={objectEntry.extraSeats ? formatToRuble(objectEntry.priceExtraSeat) : 'Нет'}
          rightAlignment
        />
        <div className="mt-2 border-t pt-1 grid grid-cols-[2fr,_1fr,_1fr,_36px] items-center gap-2">
          <div></div>
          <div className="text-gray-500">Будни</div>
          <div className="text-gray-500">Выходные</div>
          <Button
            className="justify-self-end"
            isIconButton
            onClick={() => setIsAddFuturePriceShown(!isAddFuturePriceShown)}
          >
            <Plus />
          </Button>
          <div>Текущие цены</div>
          <div>{formatToRuble(objectEntry.priceWeekdays)}</div>
          <div className="col-span-2">{formatToRuble(objectEntry.priceWeekends)}</div>
        </div>

        <AccordionTransition show={isAddFuturePriceShown}>
          <div className="grid grid-cols-3 gap-2">
            <Input label="Начало"></Input>
            <Input label="Будни"></Input>
            <Input label="Выходные"></Input>
          </div>
        </AccordionTransition>

        <div className="mt-2 font-semibold flex items-center justify-between border-t pt-1">
          Праздничные цены
          <Button isIconButton onClick={() => setIsAddHolidayPriceShown(!isAddHolidayPriceShown)}>
            <Plus />
          </Button>
        </div>
        <AccordionTransition show={isAddHolidayPriceShown}>
          <div className="grid grid-cols-3 gap-2">
            <Input label="Начало"></Input>
            <Input label="Конец"></Input>
            <Input label="Цена"></Input>
          </div>
        </AccordionTransition>
      </div>
    </Card>
  );
}
