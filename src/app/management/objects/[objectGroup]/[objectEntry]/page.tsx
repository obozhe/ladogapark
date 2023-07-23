import { fieldsMapping } from 'core/fieldsMapping';
import formatToRuble from 'core/helpers/formatNumbers';
import { redirect } from 'next/navigation';
import { getObjectEntryById } from 'server/objects/ObjectCollection';
import Breadcrumbs from 'ui/Breadcrumbs';
import Card from 'ui/Card';
import Field from 'components/ManagementPage/Field';
import IsActiveField from 'components/ManagementPage/IsActiveField';
import ActionIconButton from 'ui/ActionIconButton';
import { Plus } from 'lucide-react';
import Button from 'ui/Button';
import { ObjectTypes } from 'server/objects/types';

export default async function ObjectEntryPage({ params }: { params: { objectEntry: string } }) {
  const objectEntry = await getObjectEntryById(params.objectEntry);

  if (!objectEntry) {
    return redirect('/not-found');
  }

  const breadcrumbs = [
    { link: '/management/objects', title: 'Группы объектов' },
    { link: `/management/objects/${objectEntry.objectGroup.id}`, title: objectEntry.objectGroup.title },
    { link: `/management/objects/${objectEntry.objectGroup.id}/${objectEntry.id}`, title: objectEntry.title },
  ];

  const Details = () => (
    <Card title="Детали" titleComponent={<IsActiveField isActive={objectEntry.isActive} />}>
      <div className="flex flex-col gap-1">
        <Field label="Тип брони" value={fieldsMapping[objectEntry.objectGroup.type]} rightAlignment />
        <Field label="Базовая вместимость" value={objectEntry.seats} rightAlignment />
        <Field label="Дополнительных мест" value={objectEntry.extraSeats} rightAlignment />
        <Field label="Парковочных мест" value={objectEntry.parking} rightAlignment />
      </div>
    </Card>
  );

  const Description = () => (
    <Card title="Описание">
      <></>
    </Card>
  );

  const Prices = () => (
    <Card title="Стоимость">
      <div className="flex flex-col gap-1">
        <Field label="Предоплата" value={objectEntry.prepay ? objectEntry.prepay + '%' : 'Нет'} rightAlignment />
        <Field
          label="Доп. место"
          value={objectEntry.extraSeats ? formatToRuble(objectEntry.priceExtraSeat) : 'Нет'}
          rightAlignment
        />
        <div className="mt-2 font-semibold flex items-center justify-between border-t pt-1">
          Текущие цены
          <Button isIconButton>
            <Plus />
          </Button>
        </div>
        <Field label="Будни" value={formatToRuble(objectEntry.priceWeekdays)} rightAlignment />
        <Field label="Выходные" value={formatToRuble(objectEntry.priceWeekends)} rightAlignment />

        <div className="mt-2 font-semibold flex items-center justify-between border-t pt-1">
          Праздничные цены
          <Button isIconButton>
            <Plus />
          </Button>
        </div>
      </div>
    </Card>
  );

  const Units = () => (
    <Card
      title="Юниты"
      titleComponent={
        <Button isIconButton color="primary" size="xs">
          <Plus />
        </Button>
      }
    >
      <></>
    </Card>
  );

  const MinOrderDays = () => (
    <Card
      title="Ограничения бронирований"
      titleComponent={
        <Button isIconButton color="primary" size="xs">
          <Plus />
        </Button>
      }
    >
      <></>
    </Card>
  );

  const DiscountByDaysCount = () => (
    <Card
      title="Скидка при брони на число дней"
      titleComponent={
        <Button isIconButton color="primary" size="xs">
          <Plus />
        </Button>
      }
    >
      <></>
    </Card>
  );

  const PromoCodes = () => (
    <Card
      title="Промокоды"
      titleComponent={
        <Button isIconButton color="primary" size="xs">
          <Plus />
        </Button>
      }
    >
      <></>
    </Card>
  );

  const Included = () => (
    <Card title="Включено в стоимость">
      <></>
    </Card>
  );

  const ExtraServices = () => (
    <Card
      title="Дополнительные услуги"
      titleComponent={
        <Button isIconButton color="primary" size="xs">
          <Plus />
        </Button>
      }
    >
      <></>
    </Card>
  );

  return (
    <>
      <Breadcrumbs links={breadcrumbs} />
      <div className="grid grid-cols-[2fr,_1fr] gap-8">
        <div className="grid grid-cols-[2fr,_1fr] gap-8 h-fit">
          <div className="flex flex-col gap-8">
            <Details />
            <Description />
          </div>

          <div className="flex flex-col gap-8">
            <Prices />
            <Units />
          </div>
        </div>

        <div className="h-fit grid gap-8">
          {objectEntry.objectGroup.type === ObjectTypes.House && (
            <>
              <MinOrderDays />
              <DiscountByDaysCount />
              <PromoCodes />
            </>
          )}

          <Included />
          <ExtraServices />
        </div>
      </div>
    </>
  );
}
