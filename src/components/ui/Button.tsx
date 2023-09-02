import { IconLoader2 } from '@tabler/icons-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Size, sizes } from 'core/enums/ui-sizes';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  color?: 'secondary' | 'primary' | 'transparent' | 'error';
  isIconButton?: boolean;
  size?: Size;
  fullWidth?: boolean;
  circle?: boolean;
  isLoading?: boolean;
};

const Button = ({
  children,
  color = 'transparent',
  type = 'button',
  isIconButton,
  className,
  size = 'md',
  fullWidth = false,
  circle = false,
  disabled = false,
  isLoading = false,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={twMerge(
        'flex items-center justify-center',
        'border-none text-sm font-medium transition-all',
        color === 'primary' ? 'bg-primary text-white hover:bg-opacity-70' : '',
        color === 'secondary' ? 'bg-gray-500 text-white hover:bg-opacity-70' : '',
        color === 'error' ? 'bg-error text-white hover:bg-opacity-70' : '',
        color === 'transparent' ? 'bg-transparent text-primary hover:bg-gray-200' : '',
        disabled ? '!pointer-events-none !bg-gray-200 !text-gray-400' : '',
        !isIconButton ? 'px-4 py-2' : '',
        isIconButton ? 'p-1' : '',
        circle ? 'rounded-full' : 'rounded-[10px]',
        fullWidth ? 'w-full' : 'w-fit',
        className
      )}
      style={{
        height: sizes[size],
        width: isIconButton ? sizes[size] : '',
      }}
    >
      {isLoading ? <IconLoader2 className="animate-spin" /> : children}
    </button>
  );
};

export default Button;
