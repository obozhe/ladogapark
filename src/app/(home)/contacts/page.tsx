import Link from 'next/link';
import HousesContacts from 'components/HomePage/HousesContacts';
import Button from 'ui/Button';
import { Input } from 'ui/Input';
import Textarea from 'ui/Textarea';

const onSubmit = async (formData: FormData) => {
  'use server';
};

const Contacts = () => {
  return (
    <div className="layout-container">
      <HousesContacts />
      <section className="mobile-container mt-10 grid grid-cols-1 gap-4 font-semibold lg:grid-cols-[2fr,1fr,1fr]">
        <div className="max-w-[450px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xl">Задайте любой вопрос</span>
            <span className="font-medium text-tertiary">Ответим в течение дня</span>
          </div>
          <form action={onSubmit}>
            <Input required name="name" placeholder="Имя" _size="lg" />
            <Input required type="email" name="email" placeholder="E-mail" _size="lg" />
            <Textarea required name="message" placeholder="Введите сообщение" />
            <Button type="submit" color="primary" fullWidth>
              Отправить
            </Button>
          </form>
          <p className="mt-4 text-sm text-tertiary">
            Отправляя сообщение, вы подтверждаете своё согласие с{' '}
            <Link href="/" className="text-primary">
              политикой конфиденциальности.
            </Link>
          </p>
        </div>
        <div>
          <p className="mb-4 w-fit border-b-[3px] border-black pb-2 text-xl">На машине</p>
          <div className="flex flex-col gap-4">
            <p>Двигаться по трассе А-128 «Санкт-Петербург – Морье»</p>
            <p>Проехать Всеволожск, деревни Романовку, Борисову Гриву, Ваганово</p>
            <p>У мемориала «Разорванное кольцо» – направо</p>
            <p>Проехать футбольное поле и кафе «Ладожский берег» – до указателя на территорию «Ладога парк»</p>
            <p>На месте: направо, под шлагбаум</p>
          </div>
        </div>
        <div>
          <p className="mb-4 w-fit border-b-[3px] border-black pb-2 text-xl">Общественный транспорт</p>
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
