import { sanitize } from 'isomorphic-dompurify';
import { ReactNode } from 'react';
import { Service } from '@prisma/client';
import DynamicTablerIcon from 'components/DynamicTablerIcon';
import ServicesDialog from 'components/ServicesPage/ServicesDialog';
import ShowInfo from 'components/ServicesPage/ServicesShowInfo';
import { getServicesSorted } from 'server/services';

type Props = {
  searchParams: { openModal: string };
};

type ServicesItemsProps = {
  services: Service[];
  openModal: string;
  children?: ReactNode;
  className?: string;
};

export const ServicesItems = ({ services, openModal, children, className }: ServicesItemsProps) => {
  return (
    <>
      <div className={className}>
        <h2>Услуги</h2>
        <div className="grid auto-rows-fr grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col gap-2 rounded-lg p-5 shadow">
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
        {children}
      </div>
      <ServicesDialog isOpen={Boolean(openModal)} {...services.find((service) => service.id === openModal)!} />
    </>
  );
};

const Services = async ({ searchParams }: Props) => {
  const services = await getServicesSorted();

  return (
    <ServicesItems
      services={services}
      openModal={searchParams.openModal}
      className="layout-container mt-14 flex flex-col gap-14"
    />
  );
};

export default Services;
