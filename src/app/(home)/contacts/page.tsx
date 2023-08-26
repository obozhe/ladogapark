import Link from 'next/link';
import ContactsForm from 'components/ContactsPage/ContactsForm';
import HousesContacts from 'components/HomePage/HousesContacts';

const Contacts = () => {
  return (
    <div className="layout-container">
      <HousesContacts />
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-[2fr,1fr,1fr] gap-4 font-semibold">
        <div className="max-w-[450px]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl">Задайте любой вопрос</span>
            <span className="text-tertiary font-medium">Ответим в течение дня</span>
          </div>
          <ContactsForm />
          <p className="text-sm text-tertiary mt-4">
            Отправляя сообщение, вы подтверждаете своё согласие с{' '}
            <Link href="" className="text-primary">
              политикой конфиденциальности.
            </Link>
          </p>
        </div>
        <div>
          <p className="pb-2 mb-4 w-fit border-b-[3px] border-black text-xl">На машине</p>
          <div className="flex flex-col gap-4">
            <p>Двигаться по трассе А-128 «Санкт-Петербург – Морье»</p>
            <p>Проехать Всеволожск, деревни Романовку, Борисову Гриву, Ваганово</p>
            <p>У мемориала «Разорванное кольцо» – направо</p>
            <p>Проехать футбольное поле и кафе «Ладожский берег» – до указателя на территорию «Ладога парк»</p>
            <p>На месте: направо, под шлагбаум</p>
          </div>
        </div>
        <div>
          <p className="pb-2 mb-4 border-b-[3px] border-black w-fit text-xl">Общественный транспорт</p>
          <div className="flex flex-col gap-4">
            <p>От Финляндского вокзала – до Ваганово</p>
            <p>На автобусе №602 – до Коккорево (5 км, предварительно рекомендуем свериться с расписанием автобусом)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;
