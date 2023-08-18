import Image from 'next/image';
import HouseCardPrice from 'components/BookingPage/HouseCardPrice';
import { getGroups } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../public/images/test-house.png';

const Booking = async () => {
  const group = await getGroups();

  return (
    <>
      <h2 className="mb-6">Бронирование</h2>
      <div className="flex flex-col gap-12">
        {group.map((group) => {
          return (
            <div key={group.id} className="grid grid-cols-[2fr,1fr] gap-12">
              <Image src={HouseTest} alt="house image" className="w-full flex-[70%]" />
              <HouseCardPrice object={group} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Booking;
