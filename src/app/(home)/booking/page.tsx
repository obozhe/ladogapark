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
        {group.map((group) => {
          if (!group.entries.length) return;

          return (
            <div key={group.id} className="grid grid-cols-[2fr,1fr] gap-12">
              <Image src={HouseTest} alt="house image" className="w-full flex-[70%]" />
              <HouseCardPrice group={group} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Booking;
