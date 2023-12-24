import { IconLocation, IconMail, IconPhone } from '@tabler/icons-react';
import YandexMap from 'components/HomePage/YandexMap';
import MediaLinks from 'components/MediaLinks';
import YandexReviews from 'components/YandexReviews';
import { getSettings } from 'server/settings';

const HousesContacts = async () => {
  const settings = await getSettings();

  return (
    <section className="mobile-container flex flex-col gap-4">
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
              <span>{settings?.contacts.phones[0]}</span>
              <span>{settings?.contacts.phones[1]}</span>
            </div>
          </div>
          <div className="flex items-center gap-5 md:gap-10">
            <IconLocation size={40} color="rgb(255, 170, 5)" />
            <span className="text-sm lg:text-xs">{settings?.contacts.address}</span>
          </div>
        </div>
        <div className="hidden flex-col gap-5 md:flex">
          <span>Соцсети и Мессенджеры:</span>
          <div className="flex gap-4 self-end">
            <MediaLinks size={40} contacts={settings?.contacts} />
          </div>
          <YandexReviews className="self-end" />
        </div>
      </div>
      <YandexMap />
      <div className="flex flex-col gap-5 text-xl font-semibold md:hidden">
        <span>Соцсети и Мессенджеры:</span>
        <div className="flex gap-4">
          <MediaLinks size={40} contacts={settings?.contacts} />
        </div>
      </div>
    </section>
  );
};

export default HousesContacts;
