import { getWeather } from 'api/weather';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { twMerge } from 'tailwind-merge';
import HousesFilter from '../../components/HomePage/HousesFilter';
import Houses from 'components/HomePage/Houses';
import HousesContacts from 'components/HomePage/HousesContacts';
import ServicesItems from 'components/ServicesPage/ServicesItems';
import { getMainPageImages } from 'server/gallery';
import { getNews } from 'server/news';
import { getObjectEntries } from 'server/objects/ObjectCollection';
import { ObjectTypes } from 'server/objects/types';
import { getServicesMain } from 'server/services';
import Disclosure from 'ui/Disclosure';
import Slider from 'ui/Slider';
import Loading from './loading';

type Props = {
  searchParams: {
    from: string;
    type: ObjectTypes;
    openModal: string;
  };
};

const Search = async () => {
  // const weather = await getWeather();
  const t = await new Promise((res) => setTimeout(() => res(1), 10000));
  const news = await getNews();

  return (
    <section className="relative flex flex-col items-center justify-center gap-14 px-2 pb-[253px] pt-[153px]">
      <div className="absolute top-0 -z-10 h-full w-full bg-home-image bg-cover bg-center brightness-[35%]" />
      <div className="text-left text-3xl font-semibold text-white md:text-center md:text-6xl">
        <p>Аренда домов на берегу</p>
        <p>Ладожского озера</p>
      </div>
      <div className="flex flex-col gap-5 text-center">
        <HousesFilter />
        {/* {weather && (
          <span className="text-white font-semibold text-xl">
            У нас сейчас {weather[0]} на выходных {weather[1] ?? weather[0]}
          </span>
        )} */}
      </div>
      {Boolean(news.length) && (
        <Slider
          autoPlay
          items={news.map((newsItem) => ({
            title: newsItem.title,
            content: newsItem.content,
            date: dayjs(newsItem.updatedAt).format('DD.MM.YYYY'),
          }))}
        />
      )}
    </section>
  );
};

const Services = async ({ openModal }: { openModal: string }) => {
  const services = await getServicesMain();

  return (
    <ServicesItems services={services} openModal={openModal} className="mobile-container flex flex-col gap-4">
      <Link href="/services" className="self-end font-semibold">
        Смотреть все услуги
      </Link>
    </ServicesItems>
  );
};

const Faq = () => {
  const questions = [
    {
      title: 'Хорошая ли сотовая связь, интернет?',
      description: `Недалеко от нас расположена вышка сотовой связи Билайн, поэтому Билайн у нас ловит хорошо, в среднем 3 палочки. Остальные операторы тоже ловят, но сигнала хватает либо для телефонных звонков, либо для мессенджеров — интернет слабый.
  В каждом доме у нас стоят 4G-роутеры с симками Билайн. Поэтому в домиках интернет, как правило, хороший: можно и фильм посмотреть, и поработать при необходимости.`,
    },
    {
      title: 'Хорошая ли сотовая связь, интернет?',
      description: `Недалеко от нас расположена вышка сотовой связи Билайн, поэтому Билайн у нас ловит хорошо, в среднем 3 палочки. Остальные операторы тоже ловят, но сигнала хватает либо для телефонных звонков, либо для мессенджеров — интернет слабый.
  В каждом доме у нас стоят 4G-роутеры с симками Билайн. Поэтому в домиках интернет, как правило, хороший: можно и фильм посмотреть, и поработать при необходимости.`,
    },
    {
      title: 'Хорошая ли сотовая связь, интернет?',
      description: `Недалеко от нас расположена вышка сотовой связи Билайн, поэтому Билайн у нас ловит хорошо, в среднем 3 палочки. Остальные операторы тоже ловят, но сигнала хватает либо для телефонных звонков, либо для мессенджеров — интернет слабый.
  В каждом доме у нас стоят 4G-роутеры с симками Билайн. Поэтому в домиках интернет, как правило, хороший: можно и фильм посмотреть, и поработать при необходимости.`,
    },
    {
      title: 'Хорошая ли сотовая связь, интернет?',
      description: `Недалеко от нас расположена вышка сотовой связи Билайн, поэтому Билайн у нас ловит хорошо, в среднем 3 палочки. Остальные операторы тоже ловят, но сигнала хватает либо для телефонных звонков, либо для мессенджеров — интернет слабый.
  В каждом доме у нас стоят 4G-роутеры с симками Билайн. Поэтому в домиках интернет, как правило, хороший: можно и фильм посмотреть, и поработать при необходимости.`,
    },
    {
      title: 'Хорошая ли сотовая связь, интернет?',
      description: `Недалеко от нас расположена вышка сотовой связи Билайн, поэтому Билайн у нас ловит хорошо, в среднем 3 палочки. Остальные операторы тоже ловят, но сигнала хватает либо для телефонных звонков, либо для мессенджеров — интернет слабый.
  В каждом доме у нас стоят 4G-роутеры с симками Билайн. Поэтому в домиках интернет, как правило, хороший: можно и фильм посмотреть, и поработать при необходимости.`,
    },
  ];

  return (
    <section className="mobile-container">
      <h2 className="mb-10">FAQ</h2>
      <div className="md:pl-[35%]">
        {questions.map((question) => {
          const title = <span className="text-2xl font-semibold">{question.title}</span>;
          const description = question.description;

          return (
            <Disclosure
              className="border-t-2 border-black py-4 last:border-b-2"
              title={title}
              description={description}
              key={question.title}
            />
          );
        })}
      </div>
    </section>
  );
};

const Photos = async () => {
  const photos = await getMainPageImages();

  return (
    <section className="flex flex-col gap-4 font-semibold">
      <h2>Фотографии</h2>
      <div className="flex gap-4 overflow-auto md:grid md:grid-cols-3 md:grid-rows-1 md:gap-12">
        {photos.map((photo, index) => (
          <Image
            src={process.env.NEXT_PUBLIC_UPLOADS_URL + photo.image}
            alt="house"
            key={index}
            width={200}
            height={100}
            className={twMerge(
              index === 2 && 'col-span-2',
              index === 3 && 'col-start-3 row-span-2 row-start-1',
              'flex-1'
            )}
          />
        ))}
      </div>
      <Link href="/photos" className="self-end font-semibold">
        Смотреть все фотографии
      </Link>
    </section>
  );
};

export default async function Home({ searchParams }: Props) {
  const objectEntries = (await getObjectEntries()).filter(
    (entry) => entry.group.type === (searchParams.type ?? 'Daily')
  );

  return (
    <main>
      {/* <div className="h-5 w-5">
        <Image
          src={process.env.NEXT_PUBLIC_UPLOADS_URL + '91f26491-85ce-4596-a875-8cb0dea4b8a9.jpg'}
          alt="test"
          className="h-full w-full"
          width={0}
          height={0}
        />
      </div> */}
      <Suspense>
        <Search />
      </Suspense>
      <div className="layout-container flex flex-col gap-36 pt-[150px]">
        <Houses objectEntries={objectEntries} />
        <Services openModal={searchParams.openModal} />
        <Faq />
        <Photos />
        <HousesContacts />
      </div>
    </main>
  );
}
