'use client';

import { sanitize } from 'isomorphic-dompurify';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import Field from 'components/ManagementPage/Field';
import IsActiveField from 'components/ManagementPage/IsActiveField';
import BookingLimitationsCard from 'components/ManagementPage/Objects/Entry/BookingLimitationsCard';
import DiscountsByDaysCountCard from 'components/ManagementPage/Objects/Entry/DiscountsByDaysCountCard';
import PricesCard from 'components/ManagementPage/Objects/Entry/PricesCard';
import PromoCodesCard from 'components/ManagementPage/Objects/Entry/PromoCodesCard';
import UnitsCard from 'components/ManagementPage/Objects/Entry/UnitsCard';
import axios from 'core/axios';
import { fieldsMapping } from 'core/fieldsMapping';
import { ObjectEntryWithGroup, ObjectTypes } from 'server/objects/types';
import Breadcrumbs from 'ui/Breadcrumbs';
import Button from 'ui/Button';
import Card from 'ui/Card';
import Loader from 'ui/Loader';

const request = (url: string) => axios.get<ObjectEntryWithGroup>(url);

export default function ObjectEntryPage({ params }: { params: { objectEntry: string } }) {
  const { data: objectEntry, isLoading, error } = useSWR(`/management/objects/entries/${params.objectEntry}`, request);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !objectEntry) {
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
      <div className="flex flex-col gap-1">
        <p>{objectEntry.description}</p>
        <div
          className="border-t pt-1"
          dangerouslySetInnerHTML={{
            __html: sanitize(objectEntry.content),
          }}
        />
      </div>
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
      <div className="grid grid-cols-[2fr,_3fr] gap-8">
        <div className="flex flex-col gap-8">
          <Details />
          <Description />
        </div>

        <div className="grid grid-cols-[1fr,_1fr] gap-8 h-fit">
          <div className="flex flex-col gap-8">
            <PricesCard objectEntry={objectEntry} />
            <UnitsCard objectEntryId={objectEntry.id} />
          </div>

          <div className="h-fit grid gap-8 min-w-[360px]">
            {objectEntry.objectGroup.type === ObjectTypes.House && (
              <>
                <BookingLimitationsCard objectEntryId={objectEntry.id} />
                <DiscountsByDaysCountCard objectEntryId={objectEntry.id} />
                <PromoCodesCard objectEntryId={objectEntry.id} />
              </>
            )}

            <Included />
            <ExtraServices />
          </div>
        </div>
      </div>
    </>
  );
}
