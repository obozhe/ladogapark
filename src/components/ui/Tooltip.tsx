import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: ReactNode;
  text: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Tooltip = ({ children, text, className, ...rest }: Props) => {
  return (
    <div className={twMerge('group relative', className)} {...rest}>
      <span className="absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-black p-2 text-white group-hover:inline-block">
        {text}
      </span>
      {children}
    </div>
  );
};

export default Tooltip;
