import ServicesItems from 'components/ServicesPage/ServicesItems';
import { getServicesSorted } from 'server/services';

type Props = {
  searchParams: { openModal: string };
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
