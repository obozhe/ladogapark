import { IconSelect } from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Size, sizes } from 'core/enums/ui-sizes';
import { Listbox, Transition } from '@headlessui/react';

type Option = { label: string; value: string | number; isDisabled?: boolean };

export type CustomOptionProps = {
  option: Option;
  label?: string;
};

type Props<Value> = {
  label?: string;
  value?: Value;
  onChange: (value: Value) => void;
  options: Option[];
  fullWidth?: boolean;
  showAbove?: boolean;
  size?: Size;
  className?: string;
  CustomOption?: ({ option, label }: CustomOptionProps) => React.JSX.Element;
  showIcon?: boolean;
  error?: string;
};

const Select = <Value extends string | number>({
  label,
  options,
  value,
  fullWidth,
  showAbove,
  onChange,
  className,
  CustomOption,
  size = 'sm',
  showIcon = true,
  error,
}: Props<Value>) => {
  const [selectedOptionValue, setSelectedOptionValue] = useState<Value | undefined>(
    // @ts-ignore
    () => value ?? options.find((option) => !option.isDisabled)?.value ?? ''
  );

  const handleChange = (newOptionValue: Value) => {
    setSelectedOptionValue(newOptionValue);
    onChange(newOptionValue);
  };

  return (
    <fieldset style={{ width: fullWidth ? '100%' : 'fit-content' }} className="flex flex-col gap-2">
      {label && (
        <label htmlFor={label + '-field'} className="text-sm font-semibold text-tertiary">
          <span>{label}</span>
        </label>
      )}

      <Listbox value={selectedOptionValue} onChange={handleChange}>
        {({ open }) => (
          <div className="relative h-full w-full">
            <Listbox.Button
              style={{ height: sizes[size] }}
              className={twMerge(
                'bg-bg-main relative h-full w-full cursor-default rounded-[10px] border-2 border-black pl-3 pr-10 text-left focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary',
                error && 'border-error',
                className
              )}
            >
              <span className="block truncate">{options.find((o) => o.value === selectedOptionValue)?.label}</span>
              {showIcon && (
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <IconSelect
                    className={twMerge('h-5 w-5', open && 'rotate-180')}
                    aria-hidden="true"
                    color={error ? 'rgb(204,39,39)' : 'black'}
                  />
                </span>
              )}
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition ease-in duration-100"
              enterFrom="opacity-0 -translate-y-5"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-5"
            >
              <Listbox.Options
                className={twMerge(
                  'absolute z-10 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                  showAbove ? 'bottom-full mb-1' : 'top-full mt-1',
                  fullWidth && 'w-full'
                )}
              >
                {options.map((option, index) =>
                  CustomOption ? (
                    <CustomOption key={`${label}_${option.value}_${index}`} option={option} />
                  ) : (
                    <Listbox.Option
                      key={`${label}_${option.value}_${index}`}
                      className={({ active }) =>
                        twMerge(
                          'relative cursor-pointer select-none px-4 py-2',
                          active ? 'bg-secondary text-white' : 'text-primary',
                          option.isDisabled && 'text-gray-400'
                        )
                      }
                      disabled={option.isDisabled}
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.label}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  )
                )}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      {error && <span className="text-sm font-semibold text-error">{error}</span>}
    </fieldset>
  );
};

export default Select;
