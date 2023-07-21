import { fieldsMapping } from 'core/fieldsMapping';
import Link from 'next/link';
import { getObjectGroupsWithObjects } from 'server/objects/ObjectsCollection';
import Field from 'ui/Field';

export default async function ObjectsPage() {
  return (
    <div>
      <div className="w-full bg-white p-4 rounded mb-8 font-bold">Группы объектов</div>
      {(await getObjectGroupsWithObjects()).map((group) => (
        <div key={group.id} className="w-full bg-white p-4 rounded mb-4">
          <h3 className="border-b pb-2">{group.title}</h3>
          <div className="grid grid-cols-2 pt-2">
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
                    href={`/management/objects/${object.id}`}
                    className="font-semibold text-sky-500 hover:text-sky-700"
                  >
                    {object.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
