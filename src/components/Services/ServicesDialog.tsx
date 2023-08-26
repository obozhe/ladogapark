'use client';

import usePrevious from 'hooks/usePrevious';
import useRouterParams from 'hooks/useRouterParams';
import Dialog from 'ui/Dialog';

type Props = {
  isOpen: boolean;
  content: string;
  title: string;
};

const ServicesDialog = ({ ...rest }: Props) => {
  const { deleteQueryParams } = useRouterParams();

  return <Dialog {...rest} closeModal={() => deleteQueryParams('showInfo')} />;
};

export default ServicesDialog;
