import Image from 'next/image';
import HouseCardPrice from 'components/BookingPage/HouseCardPrice';
import { getObjectGroups } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../public/images/test-house.png';

const Booking = async () => {
  const objectGroup = await getObjectGroups();

  return (
    <>
      <h2 className="mb-6">Бронирование</h2>
      <div className="flex flex-col gap-12">
        {objectGroup.map((objectGroup) => {
          return (
            <div key={objectGroup.id} className="grid grid-cols-[2fr,1fr] gap-12">
              <Image src={HouseTest} alt="house image" className="w-full flex-[70%]" />
              <HouseCardPrice object={objectGroup} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Booking;
