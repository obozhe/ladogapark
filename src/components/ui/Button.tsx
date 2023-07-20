import { twMerge } from 'tailwind-merge';
import { Size, sizes } from 'core/enums/ui-sizes';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  color?: 'secondary' | 'primary' | 'transparent' | 'error';
  isIconButton?: boolean;
  size?: Size;
  fullWidth?: boolean;
  circle?: boolean;
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
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={twMerge(
        'flex justify-center items-center',
        'uppercase transition-all border-none text-sm font-medium',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary',
        color === 'primary' ? 'bg-primary text-white hover:bg-opacity-70' : '',
        color === 'secondary' ? 'bg-gray-500 text-white hover:bg-opacity-70' : '',
        color === 'error' ? 'bg-error text-white hover:bg-opacity-70' : '',
        color === 'transparent' ? 'bg-transparent text-primary hover:bg-gray-200' : '',
        disabled ? '!bg-gray-200 !text-gray-400 !pointer-events-none' : '',
        !isIconButton ? 'px-4 py-2' : '',
        isIconButton ? 'p-1' : '',
        circle ? 'rounded-full' : 'rounded-md',
        fullWidth ? 'w-full' : 'w-fit',
        className
      )}
      style={{
        height: sizes[size],
        width: isIconButton ? sizes[size] : '',
      }}
    >
      {children}
    </button>
  );
};

export default Button;
