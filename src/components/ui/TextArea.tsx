import clsx from 'clsx';
import { TextareaHTMLAttributes } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    disableHelper?: boolean;
    error?: string | boolean;
};

const TextArea = ({ label, error, disableHelper, rows = 4, ...rest }: Props) => {
    return (
        <fieldset>
            <label htmlFor={label + '-field'}>
                <span className="font-semibold uppercase">{label}</span>
            </label>
            <textarea
                {...rest}
                id={label + '-field'}
                rows={rows}
                className={clsx(
                    { 'border-error focus:border-error focus:ring-error': error },
                    'text-slate-600 rounded p-2 w-full border-3 border-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 invalid:border-error invalid:text-error focus:invalid:border-error focus:invalid:ring-error'
                )}
            />
            {!disableHelper && <div className="text-sm text-error h-5">{error ?? ''}</div>}
        </fieldset>
    );
};

export default TextArea;
