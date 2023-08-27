import { IconLocation, IconMail, IconPhone } from '@tabler/icons-react';
import YandexMap from 'components/HomePage/YandexMap';
import MediaLinks from 'components/MediaLinks';
import YandexReviews from 'components/YandeReviews';

const HousesContacts = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="mb-10">Контакты</h2>
      <div className="flex justify-between gap-3 flex-row font-semibold text-xl">
        <div className="flex flex-col gap-10">
          <div className="flex gap-5 md:gap-10 items-center">
            <IconMail size={40} color="rgb(255, 170, 5)" />
            <span>booking@ladogapark.ru</span>
          </div>
          <div className="flex gap-5 md:gap-10 items-center">
            <IconPhone size={40} color="rgb(255, 170, 5)" />
            <div className="flex flex-col font-inter font-medium">
              <span>+7 (929) 111-01-51</span>
              <span>+7 (931) 213-00-48</span>
            </div>
          </div>
          <div className="flex gap-5 md:gap-10 items-center">
            <IconLocation size={40} color="rgb(255, 170, 5)" />
            <span>Всеволожский р-н Ленобласти, деревня Коккорево, 40 км от Санкт-Петербурга</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-5">
          <span>Соцсети и Мессенджеры:</span>
          <div className="flex gap-4 self-end">
            <MediaLinks size={40} />
          </div>
          <YandexReviews className="self-end" />
        </div>
      </div>
      <YandexMap />
      <div className="md:hidden flex flex-col gap-5 font-semibold text-xl">
        <span>Соцсети и Мессенджеры:</span>
        <div className="flex gap-4">
          <MediaLinks size={40} />
        </div>
      </div>
    </section>
  );
};

export default HousesContacts;
