import { fieldsMapping } from 'core/fieldsMapping';
import formatToRuble from 'core/helpers/formatNumbers';
import { redirect } from 'next/navigation';
import { getObjectEntryById } from 'server/objects/ObjectCollection';
import Breadcrumbs from 'ui/Breadcrumbs';
import Card from 'ui/Card';
import Field from 'components/ManagementPage/Field';
import IsActiveField from 'components/ManagementPage/IsActiveField';

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

  return (
    <>
      <Breadcrumbs links={breadcrumbs} />
      <div className="grid grid-cols-3 gap-8">
        <Card title="Детали" titleComponent={<IsActiveField isActive={objectEntry.isActive} />}>
          <div className="flex flex-col gap-1">
            <Field label="Тип брони" value={fieldsMapping[objectEntry.objectGroup.type]} rightAlignment />
            <Field label="Базовая вместимость" value={objectEntry.seats} rightAlignment />
            <Field label="Дополнительных мест" value={objectEntry.extraSeats} rightAlignment />
            <Field label="Парковочных мест" value={objectEntry.parking} rightAlignment />
          </div>
        </Card>

        <Card title="Стоимость">
          <div className="flex flex-col gap-1">
            <Field label="Предоплата" value={objectEntry.prepay ? objectEntry.prepay + '%' : 'Нет'} rightAlignment />
            <Field
              label="Доп. место"
              value={objectEntry.extraSeats ? formatToRuble(objectEntry.priceExtraSeat) : 'Нет'}
              rightAlignment
            />
          </div>
        </Card>
      </div>
    </>
  );
}
