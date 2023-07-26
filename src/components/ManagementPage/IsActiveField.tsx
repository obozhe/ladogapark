import { twMerge } from 'tailwind-merge';

type Props = {
  isActive: boolean;
  hideText?: boolean;
};

export default function IsActiveField({ isActive, hideText }: Props) {
  return (
    <div className={twMerge('place-items-center flex gap-2', isActive ? 'text-success' : 'text-error')}>
      <div className={twMerge('w-2 h-2 rounded-full', isActive ? 'bg-success' : 'bg-error')}></div>
      {!hideText && (isActive ? 'Включен' : 'Выключен')}
    </div>
  );
}
