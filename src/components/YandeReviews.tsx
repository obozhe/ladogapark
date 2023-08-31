import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
};

const YandexReviews = ({ className }: Props) => {
  return (
    <div className={twMerge('h-[126px] w-[200px]', className)}>
      <iframe
        src="https://yandex.ru/maps-reviews-widget/1741462834?size=m"
        style={{ width: '100%', height: '100%', border: '1px solid #e6e6e6', borderRadius: '8px' }}
      />
    </div>
  );
};

export default YandexReviews;
