import { getWeather } from 'api/weather';
import Houses from 'components/HomePage/Houses';
import YandexMap from 'components/HomePage/YandexMap';
import BusIcon from 'icons/bus.svg';
import EmailIcon from 'icons/email.svg';
import GoodsIcon from 'icons/goods.svg';
import LocationIcon from 'icons/location.svg';
import MassageIcon from 'icons/massage.svg';
import PhoneIcon from 'icons/phone.svg';
import Image from 'next/image';
import Link from 'next/link';
import { getObjectGroups } from 'server/objects/ObjectsCollection';
import { twMerge } from 'tailwind-merge';
import Button from 'ui/Button';
import Disclosure from 'ui/Disclosure';
import House1Image from '../../../public/images/house-1.png';
import House2Image from '../../../public/images/house-2.png';
import House3Image from '../../../public/images/house-3.png';
import House4Image from '../../../public/images/house-4.png';

const Search = async () => {
  const weather = await getWeather();

  return (
    <section className="relative flex flex-col justify-center items-center gap-14 pt-[153px] pb-[253px] ">
      <div className="bg-home-image absolute top-0 w-full h-full -z-10 brightness-[35%]" />
      <div className="text-white text-6xl text-center font-semibold">
        <p>Аренда домов на берегу</p>
        <p>Ладожского озера</p>
      </div>
      <div className="flex flex-col text-center gap-5">
        <div className="flex gap-3">
          <div className="h-[50px] bg-white w-[220px]" />
          <div className="h-[50px] bg-white w-[220px]" />
          <Button size="xxl" color="primary">
            Показать объекты
          </Button>
        </div>
        {weather && (
          <span className="text-white font-semibold text-xl">
            У нас сейчас {weather[0]} на выходных {weather[1] ?? weather[0]}
          </span>
        )}
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
      icon: <GoodsIcon />,
    },
    {
      title: 'Трансфер до “Ладога парк”',
      description: 'Аренда 17-местного автобуса до базы и обратно. Назначьте удобное время и место подачи',
      icon: <BusIcon />,
    },
    {
      title: 'Трансфер до “Ладога парк”',
      description:
        'Для заказа массажа необходимо заблаговременно отправить письмо на почту с указанием желаемого вида массажа, временем и датой',
      icon: <MassageIcon />,
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2>Услуги</h2>
      <div className="grid grid-cols-3 gap-12">
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
      <div className="pl-[35%]">
        {questions.map((question) => (
          <Disclosure {...question} key={question.title} />
        ))}
      </div>
    </section>
  );
};

const Photos = () => {
  const photos = [House1Image, House2Image, House3Image, House4Image];

  return (
    <section className="flex flex-col gap-4 font-semibold">
      <h2>Фотографии</h2>
      <div className="grid grid-cols-3 grid-rows-1 gap-12">
        {photos.map((photo, index) => (
          <Image
            src={photo}
            alt="house"
            key={index}
            className={twMerge(index === 2 && 'col-span-2', index === 3 && 'col-start-3 row-start-1 row-span-2')}
          />
        ))}
      </div>
      <Link href="/photos" className="self-end font-semibold">
        Смотреть все фотографии
      </Link>
    </section>
  );
};

const Contacts = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2>Контакты</h2>
      <div className="flex justify-between font-semibold text-xl">
        <div className="flex flex-col gap-10">
          <div className="flex gap-10 items-center">
            <span>
              <EmailIcon />
            </span>
            <span>booking@ladogapark.ru</span>
          </div>
          <div className="flex gap-10 items-center">
            <span>
              <PhoneIcon />
            </span>
            <div className="flex flex-col font-inter">
              <span>+7 (929) 111-01-51</span>
              <span>+7 (931) 213-00-48</span>
            </div>
          </div>
          <div className="flex gap-10 items-center">
            <span>
              <LocationIcon />
            </span>
            <span>Всеволожский р-н Ленобласти, деревня Коккорево, 40 км от Санкт-Петербурга</span>
          </div>
        </div>
        <div>Соцсети и Мессенджеры:</div>
      </div>
      <YandexMap />
    </section>
  );
};

export default async function Home() {
  const sortedObjectGroups = await getObjectGroups();

  return (
    <main>
      <Search />
      <div className="flex flex-col gap-36 pt-[150px] layout-container">
        <Houses objectGroups={sortedObjectGroups} />
        <Services />
        <Faq />
        <Photos />
        <Contacts />
      </div>
    </main>
  );
}
