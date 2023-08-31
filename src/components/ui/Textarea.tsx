import { TextareaHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  label?: string;
  disableHelper?: boolean;
  error?: string;
  helper?: string;
  endAdornment?: JSX.Element;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

// eslint-disable-next-line react/display-name
const Textarea = forwardRef<HTMLTextAreaElement | null, Props>(
  ({ label, error, helper, endAdornment, disableHelper, className = '', ...rest }, ref) => {
    return (
      <fieldset>
        <textarea
          ref={ref}
          {...rest}
          style={{ height: 100 }}
          aria-invalid={Boolean(error)}
          className={twMerge(
            'block w-full resize-none rounded border-2 p-2',
            'focus:border-secondary focus:outline-none',
            'disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500',
            error ? 'border-error text-error' : '',
            !error ? 'border-black' : '',
            className
          )}
          id={label + '-field'}
        />
        {!disableHelper && (
          <div className={twMerge('h-5 text-sm', error ? 'text-error' : 'text-gray-500')}>{error || helper || ''}</div>
        )}
      </fieldset>
    );
  }
);

export default Textarea;
