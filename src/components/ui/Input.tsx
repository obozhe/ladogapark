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
              'rounded p-2 w-full border-2',
              'focus:outline-none focus:border-secondary',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200',
              endAdornment ? 'pr-12' : '',
              error ? 'border-error text-error' : '',
              !error ? 'border-black' : '',
              className
            )}
            id={label + '-field'}
          />
          {endAdornment && (
            <span className="absolute h-9 w-9 top-1/2 -translate-y-1/2 right-2 flex justify-center items-center">
              {endAdornment}
            </span>
          )}
        </div>
        {!disableHelper && (
          <div className={twMerge('text-sm h-5', error ? 'text-error' : 'text-gray-500')}>{error || helper || ''}</div>
        )}
      </fieldset>
    );
  }
);
Input.displayName = 'Input';
