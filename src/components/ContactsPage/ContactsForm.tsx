'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from 'ui/Button';
import { Input } from 'ui/Input';
import Textarea from 'ui/Textarea';

const schema = z.object({
  name: z.string().min(1, { message: 'Обязательное поле' }),
  email: z.string().min(1, { message: 'Обязательное поле' }).email('Введите корректный email'),
  userMessage: z.string().min(1, { message: 'Обязательное поле' }),
});
type Schema = z.infer<typeof schema>;

const ContactsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Schema) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} placeholder="Имя" _size="xxl" label="name" error={errors.name?.message} />
      <Input {...register('email')} placeholder="E-mail" _size="xxl" label="email" error={errors.email?.message} />
      <Textarea
        {...register('userMessage')}
        placeholder="Введите ваше сообщение..."
        label="userMessage"
        error={errors.userMessage?.message}
      />
      <Button fullWidth color="primary" type="submit">
        Отправить
      </Button>
    </form>
  );
};

export default ContactsForm;
