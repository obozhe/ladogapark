import NavHeader from 'ui/Breadcrumbs';
import { redirect } from 'next/navigation';
import { getObjectEntryById, getObjectGroupById } from 'server/objects/ObjectCollection';
import Breadcrumbs from 'ui/Breadcrumbs';

export default async function ObjectGroupPage({ params }: { params: { objectGroup: string } }) {
  const objectGroup = await getObjectGroupById(params.objectGroup);

  if (!objectGroup) {
    return redirect('/not-found');
  }

  const breadcrumbs = [
    { link: '/management/objects', title: 'Группы объектов' },
    { link: `/management/objects/${objectGroup.id}`, title: objectGroup.title },
  ];

  return (
    <>
      <Breadcrumbs links={breadcrumbs} />
      {objectGroup.title}
    </>
  );
}
