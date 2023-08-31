import { IconLocation, IconMail, IconPhone } from '@tabler/icons-react';
import YandexMap from 'components/HomePage/YandexMap';
import MediaLinks from 'components/MediaLinks';
import YandexReviews from 'components/YandeReviews';

const HousesContacts = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="mb-10">Контакты</h2>
      <div className="flex flex-row justify-between gap-3 text-xl font-semibold">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-5 md:gap-10">
            <IconMail size={40} color="rgb(255, 170, 5)" />
            <span>booking@ladogapark.ru</span>
          </div>
          <div className="flex items-center gap-5 md:gap-10">
            <IconPhone size={40} color="rgb(255, 170, 5)" />
            <div className="flex flex-col font-inter font-medium">
              <span>+7 (929) 111-01-51</span>
              <span>+7 (931) 213-00-48</span>
            </div>
          </div>
          <div className="flex items-center gap-5 md:gap-10">
            <IconLocation size={40} color="rgb(255, 170, 5)" />
            <span>Всеволожский р-н Ленобласти, деревня Коккорево, 40 км от Санкт-Петербурга</span>
          </div>
        </div>
        <div className="hidden flex-col gap-5 md:flex">
          <span>Соцсети и Мессенджеры:</span>
          <div className="flex gap-4 self-end">
            <MediaLinks size={40} />
          </div>
          <YandexReviews className="self-end" />
        </div>
      </div>
      <YandexMap />
      <div className="flex flex-col gap-5 text-xl font-semibold md:hidden">
        <span>Соцсети и Мессенджеры:</span>
        <div className="flex gap-4">
          <MediaLinks size={40} />
        </div>
      </div>
    </section>
  );
};

export default HousesContacts;
