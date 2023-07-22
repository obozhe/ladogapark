import { twMerge } from 'tailwind-merge';

type Props = {
  isActive: boolean;
};

export default function IsActiveField({ isActive }: Props) {
  return (
    <div className={twMerge('place-items-center flex gap-2', isActive ? 'text-success' : 'text-error')}>
      <div className="w-2 h-2 bg-success rounded-full"></div>
      {isActive ? 'Показывается на сайте' : 'Не показывается на сайте'}
    </div>
  );
}
