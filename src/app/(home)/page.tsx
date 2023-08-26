import { IconBasket, IconBus, IconMassage } from '@tabler/icons-react';
import { getWeather } from 'api/weather';
import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import HousesFilter from '../../components/HomePage/HousesFilter';
import Houses from 'components/HomePage/Houses';
import HousesContacts from 'components/HomePage/HousesContacts';
import { getObjectEntries } from 'server/objects/ObjectCollection';
import { ObjectTypes } from 'server/objects/types';
import Button from 'ui/Button';
import Disclosure from 'ui/Disclosure';
import House1Image from '../../../public/images/house-1.png';
import House2Image from '../../../public/images/house-2.png';
import House3Image from '../../../public/images/house-3.png';
import House4Image from '../../../public/images/house-4.png';

type Props = {
  searchParams: {
    from: string;
    to: string;
    type: ObjectTypes;
  };
};

const Search = async () => {
  // const weather = await getWeather();

  return (
    <section className="relative flex flex-col justify-center items-center gap-14 pt-[153px] pb-[253px] px-2">
      <div className="bg-home-image absolute top-0 w-full h-full -z-10 brightness-[35%] bg-center bg-cover" />
      <div className="text-white text-3xl text-left md:text-6xl md:text-center font-semibold">
        <p>Аренда домов на берегу</p>
        <p>Ладожского озера</p>
      </div>
      <div className="flex flex-col text-center gap-5">
        <div className="grid md:grid-cols-[1fr_1fr_max-content] md:grid-rows-1 grid-rows-3 gap-3">
          <HousesFilter />
        </div>
        {/* {weather && (
          <span className="text-white font-semibold text-xl">
            У нас сейчас {weather[0]} на выходных {weather[1] ?? weather[0]}
          </span>
        )} */}
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: 'Дополнительные товары',
      description:
        'Закажите уголь, розжиг, спорт. инвентарь и другие товары для вашего отдыхаЗакажите уголь, розжиг, спорт. инвентарь и другие товары для вашего отдыха',
      icon: <IconBasket size={100} color="rgb(255, 170, 5)" strokeWidth={1.5} />,
    },
    {
      title: 'Трансфер до “Ладога парк”',
      description: 'Аренда 17-местного автобуса до базы и обратно. Назначьте удобное время и место подачи',
      icon: <IconBus size={100} color="rgb(255, 170, 5)" strokeWidth={1.5} />,
    },
    {
      title: 'Трансфер до “Ладога парк”',
      description:
        'Для заказа массажа необходимо заблаговременно отправить письмо на почту с указанием желаемого вида массажа, временем и датой',
      icon: <IconMassage size={100} color="rgb(255, 170, 5)" strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2>Услуги</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {services.map((service) => {
          return (
            <div key={service.title} className="p-5 shadow font-semibold flex flex-col">
              <div className="flex-1">
                <div className="mb-[10px]">{service.icon}</div>
                <div className="mb-[15px] text-xl">{service.title}</div>
                <p>{service.description}</p>
              </div>
              <Button className="self-end text-[15px] font-inter">заказать</Button>
            </div>
          );
        })}
      </div>
      <Link href="/services" className="self-end font-semibold">
        Смотреть все услуги
      </Link>
    </section>
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
    <section>
      <h2 className="mb-10">FAQ</h2>
      <div className="md:pl-[35%]">
        {questions.map((question) => {
          const title = <span className="font-semibold text-2xl">{question.title}</span>;
          const description = question.description;

          return (
            <Disclosure
              className="border-t-2 border-black last:border-b-2 py-4"
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

const Photos = () => {
  const photos = [House1Image, House2Image, House3Image, House4Image];

  return (
    <section className="flex flex-col gap-4 font-semibold">
      <h2>Фотографии</h2>
      <div className="flex gap-4 overflow-auto md:grid md:grid-cols-3 md:grid-rows-1 md:gap-12">
        {photos.map((photo, index) => (
          <Image
            src={photo}
            alt="house"
            key={index}
            className={twMerge(
              index === 2 && 'col-span-2',
              index === 3 && 'col-start-3 row-start-1 row-span-2',
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
          src={process.env.UPLOADS_URL + '91f26491-85ce-4596-a875-8cb0dea4b8a9.jpg'}
          alt="test"
          className="h-full w-full"
          width={0}
          height={0}
        />
      </div> */}
      <Search />
      <div className="flex flex-col gap-36 pt-[150px] layout-container px-2">
        <Houses objectEntries={objectEntries} />
        <Services />
        <Faq />
        <Photos />
        <HousesContacts />
      </div>
    </main>
  );
}
