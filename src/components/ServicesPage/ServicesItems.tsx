import { sanitize } from 'isomorphic-dompurify';
import { ReactNode } from 'react';
import { Service } from '@prisma/client';
import DynamicTablerIcon from 'components/DynamicTablerIcon';
import ServicesDialog from './ServicesDialog';
import ShowInfo from './ServicesShowInfo';

type ServicesItemsProps = {
  services: Service[];
  openModal: string;
  children?: ReactNode;
  className?: string;
};

const ServicesItems = ({ services, openModal, children, className }: ServicesItemsProps) => {
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

export default ServicesItems;
