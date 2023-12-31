'use client';

import useRouterParams from 'hooks/useRouterParams';
import Button from 'ui/Button';

type Props = {
  id: string;
};

const ShowInfo = ({ id }: Props) => {
  const { setQueryParams, isTransition } = useRouterParams();

  return (
    <Button
      color="primary"
      className="self-end"
      isLoading={isTransition}
      onClick={() => setQueryParams({ queryName: 'openModal', value: id })}
    >
      Заказать
    </Button>
  );
};

export default ShowInfo;
