import { sanitize } from 'isomorphic-dompurify';
import DynamicTablerIcon from 'components/DynamicTablerIcon';
import ServicesDialog from 'components/Services/ServicesDialog';
import ShowInfo from 'components/Services/ServicesShowInfo';
import { getServicesSorted } from 'server/services';

type Props = {
  searchParams: { showInfo: string };
};

const Services = async ({ searchParams }: Props) => {
  const services = await getServicesSorted();

  return (
    <>
      <div className="layout-container">
        <h2 className="my-14">Услуги</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-12">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col gap-2 shadow rounded-lg p-5">
              <DynamicTablerIcon icon={service.icon} size={100} className="mb-1" color="rgb(255, 170, 5)" />
              <span className="text-xl font-semibold">{service.title}</span>
              <div
                className="flex-1"
                dangerouslySetInnerHTML={{
                  __html: sanitize(service.description),
                }}
              />
              <ShowInfo id={service.id} />
            </div>
          ))}
        </div>
      </div>
      <ServicesDialog
        isOpen={Boolean(searchParams.showInfo)}
        {...services.find((service) => service.id === searchParams.showInfo)!}
      />
    </>
  );
};

export default Services;
