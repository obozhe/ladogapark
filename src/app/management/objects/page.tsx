import NavHeader from 'ui/Breadcrumbs';
import { fieldsMapping } from 'core/fieldsMapping';
import Link from 'next/link';
import { getObjectGroupsWithObjects } from 'server/objects/ObjectsCollection';
import Field from 'ui/Field';
import Breadcrumbs from 'ui/Breadcrumbs';
import Card from 'ui/Card';

const breadcrumbs = [{ link: '/management/objects', title: 'Группы объектов' }];

export default async function ObjectsPage() {
  return (
    <div>
      <Breadcrumbs links={breadcrumbs} />
      <div className="flex flex-col gap-4">
        {(await getObjectGroupsWithObjects()).map((group) => (
          <Card key={group.alias} title={group.title}>
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1 w-96">
                <Field label="Тип брони" value={fieldsMapping[group.type]} />
                <Field
                  label="Статус"
                  value={
                    group.isActive ? (
                      <span className="text-success">Показывается на сайте</span>
                    ) : (
                      <span className="text-error">Не показывается на сайте</span>
                    )
                  }
                />
              </div>

              <div>
                {group.objectEntries.map((object) => (
                  <div key={object.id} className="">
                    <Link
                      href={`/management/objects/${group.id}/${object.id}`}
                      className="font-semibold text-sky-500 hover:text-sky-700"
                    >
                      {object.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
