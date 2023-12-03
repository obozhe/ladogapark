'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useFormStatus } from 'react-dom';
import Button from './Button';

type Props = React.ComponentProps<typeof Button>;

export function SubmitButton({ children, ...rest }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} color="primary" fullWidth size="xxl" {...rest}>
      {pending ? <IconLoader2 className="animate-spin" /> : children}
    </Button>
  );
}

export default SubmitButton;
