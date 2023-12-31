import Image from 'next/image';
import HouseCardPrice from 'components/BookingPage/HouseCardPrice';
import { getGroupsWithEntriesWithFuturePrices } from 'server/objects/ObjectCollection';
import HouseTest from '../../../../public/images/test-house.png';

const Booking = async () => {
  const group = await getGroupsWithEntriesWithFuturePrices();

  return (
    <>
      <h2 className="mb-6">Бронирование</h2>
      <div className="flex flex-col gap-12">
        {group.map((group) => (
          <div key={group.id} className="grid grid-cols-1 gap-12 md:grid-cols-[2fr,1fr]">
            <Image src={HouseTest} alt="house image" className="w-full flex-[70%]" />
            <HouseCardPrice group={group} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Booking;
