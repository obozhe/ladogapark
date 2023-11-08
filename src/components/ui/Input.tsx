import React, { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Size, sizes } from 'core/enums/ui-sizes';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  disableHelper?: boolean;
  error?: string;
  helper?: string;
  endAdornment?: JSX.Element;
  _size?: Size;
};

export const Input = React.forwardRef(
  (
    { label, error, helper, endAdornment, disableHelper, _size = 'sm', className = '', ...rest }: Props,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <fieldset>
        <div className="relative">
          <input
            {...rest}
            aria-invalid={Boolean(error)}
            ref={ref}
            style={{ height: sizes[_size] }}
            className={twMerge(
              'w-full rounded-[10px] border-2 p-2',
              'focus:border-primary focus:outline-none',
              'disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500',
              endAdornment ? 'pr-12' : '',
              error ? 'border-error text-error' : '',
              !error ? 'border-black' : '',
              className
            )}
            id={label + '-field'}
          />
          {endAdornment && (
            <span className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center">
              {endAdornment}
            </span>
          )}
        </div>
        {!disableHelper && (
          <div className={twMerge('pt-2 text-sm font-semibold', error ? 'text-error' : 'text-tertiary')}>
            {error || helper || ''}
          </div>
        )}
      </fieldset>
    );
  }
);
Input.displayName = 'Input';
