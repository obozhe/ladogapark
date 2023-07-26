import { ObjectTypes } from './../src/server/objects/types';

export const objectGroups = [
  {
    title: 'Дом в лесу/ на берегу',
    alias: 'foresthouse',
    type: ObjectTypes.House,
    sorting: 1,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Дом в лесу на 7 человек',
          images: [''],
          description: 'Просторный дом для круглосуточного проживания. 3 спальни, гостиная, с/у, открытая терраса.',
          content:
            '<p>Просторный уютный дом расположен в тихом уголке леса, полностью оборудован для всесезонного проживания до 7 человек. Общая площадь 80 кв. м. с открытой террасой, тремя спальнями и кухней, совмещенной с гостиной. Для гостей нашего парка в доме предусмотрены удобства: туалетная комната, оснащенная душевой кабиной, холодильник, микроволновая печь, чайник, электрическая плита и телевизор. В стоимость аренды дома входит мангал, расположенный рядом с террасой. Имеется возможность размещения до двух дополнительных спальных мест.</p>',
          seats: 7,
          extraSeats: 2,
          priceWeekdays: 9000.0,
          priceWeekends: 12000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 1000.0,
          prepay: 100,
          minOrder: 0,
          parking: 3,
          sorting: 1,
          isActive: true,
          units: {
            create: [
              {
                number: '101',
              },
              {
                number: '102',
              },
              {
                number: '103',
              },
            ],
          },
        },
      ],
    },
  },
  {
    title: 'Кедровый гриль-домик',
    alias: 'grillhouse',
    type: ObjectTypes.Daily,
    sorting: 2,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Гриль-домик на 12 человек',
          images: [''],
          description:
            'Домик с грилем и вытяжкой стоит на пляже на широкой деревянной площадке и укроет вашу компанию от ветра и непогоды.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 12,
          extraSeats: 0,
          priceWeekdays: 6000.0,
          priceWeekends: 8500.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 2,
          isActive: true,
        },
        {
          title: 'Гриль-домик на 20 человек',
          images: [''],
          description:
            'Домик с грилем и вытяжкой стоит на пляже на широкой деревянной площадке и укроет вашу компанию от ветра и непогоды.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 20 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой, столом и удобными диванами. Так же на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 20,
          extraSeats: 0,
          priceWeekdays: 16000.0,
          priceWeekends: 16000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 3,
          isActive: true,
        },
        {
          title: 'Гриль-домик на 30 человек',
          images: [''],
          description:
            'Домик с грилем и вытяжкой стоит на пляже на широкой деревянной площадке и укроет вашу компанию от ветра и непогоды.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 30 человек. Домик отлично подойдет для большой компании. Укроет полностью от непогоды. Внутри оснащен грилем с вытяжкой, столом и стульями. Так же на улице перед домиком в пользование гостям предоставляются столы и скамейки с панорамным видом, расположенные на крытой террасе.</p>',
          seats: 30,
          extraSeats: 0,
          priceWeekdays: 20000.0,
          priceWeekends: 20000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 6,
          sorting: 4,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Веранда на берегу',
    alias: 'veranda',
    type: ObjectTypes.Daily,
    sorting: 3,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Веранда на 10 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 10,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 5,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Стол с навесом',
    alias: 'arbor',
    type: ObjectTypes.Daily,
    sorting: 8,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Стол с навесом на 6 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Веранда на берегу подойдет для комфортного размещения компании до 10 человек. Внутри помещения стоит&nbsp; большой обеденный стол со стульями и&nbsp;террасе под навесом, с которой открывается шикарный&nbsp; вид на озеро.</p>',
          seats: 10,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 6,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Кедровая баня',
    alias: 'bath',
    type: ObjectTypes.Bath,
    sorting: 7,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Кедровая баня на 6 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 6,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 7,
          isActive: true,
        },
        {
          title: 'Баня на 4 человека',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 8,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Стол для пикника',
    alias: 'picnic',
    type: ObjectTypes.Daily,
    sorting: 9,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Столик на 4 человека',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 8,
          isActive: true,
        },
        {
          title: 'Стол на 12 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 12,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 9,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Шатер',
    alias: 'tent',
    type: ObjectTypes.Daily,
    sorting: 6,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Шатер на 6 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 10,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Беседка крытая',
    alias: 'arborhexagonal',
    type: ObjectTypes.Daily,
    sorting: 5,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Беседка шестигранная на 8 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 11,
          isActive: true,
        },
        {
          title: 'Беседка восьмигранная на 12 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 12,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Кайтерская на берегу',
    alias: 'veranda_kait',
    type: ObjectTypes.Daily,
    sorting: 4,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Кайтерская на 12 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 13,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Павильон в лесу',
    alias: 'event_tent',
    type: ObjectTypes.Daily,
    sorting: 0,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Павильон в лесу от 40 человек',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 40,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 14,
          isActive: true,
        },
      ],
    },
  },
  {
    title: 'Домик рыбака',
    alias: 'fishman',
    type: ObjectTypes.House,
    sorting: 1,
    isActive: true,
    objectEntries: {
      create: [
        {
          title: 'Домик рыбака 2 человека',
          images: [''],
          description:
            'Уютная веранда с потрясающим видом расположена на берегу Ладожского озера. Прекрасно подойдет для небольшой компании.',
          content:
            '<p>Домик стоит на пляже на широкой деревянной площадке с видом на Ладожское озеро. Комфортная вместительность объекта до 12 человек. Домик укроет от ветра и непогоды. Внутри оснащен грилем с вытяжкой по центру и удобными скамейками. Также на улице рядом с домиком в пользование гостям предоставляется стол и скамейки с панорамным видом.</p>',
          seats: 4,
          extraSeats: 0,
          priceWeekdays: 7000.0,
          priceWeekends: 9000.0,
          priceRenewal: 0.0,
          priceExtraSeat: 0.0,
          prepay: 0,
          minOrder: 0,
          parking: 3,
          sorting: 15,
          isActive: true,
        },
      ],
    },
  },
];
