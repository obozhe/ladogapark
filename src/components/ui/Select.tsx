import { Fragment, useState } from 'react';
import { Select as SelectIcon } from 'tabler-icons-react';
import { twMerge } from 'tailwind-merge';
import { Size, sizes } from 'core/enums/ui-sizes';
import { Listbox, Transition } from '@headlessui/react';

type Option = { label: string; value: string | number };

export type CustomOptionProps = {
  option: Option;
  label?: string;
};

type Props<Value> = {
  label?: string;
  value: Value;
  onChange: (value: Value) => void;
  options: Option[];
  fullWidth?: boolean;
  showAbove?: boolean;
  size?: Size;
  className?: string;
  CustomOption?: ({ option, label }: CustomOptionProps) => React.JSX.Element;
  showIcon?: boolean;
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
}: Props<Value>) => {
  const [selectedOptionValue, setSelectedOptionValue] = useState<Value>(value);

  const handleChange = (newOptionValue: Value) => {
    setSelectedOptionValue(newOptionValue);
    onChange(newOptionValue);
  };

  return (
    <fieldset style={{ width: fullWidth ? '100%' : 'fit-content' }}>
      {label && (
        <label htmlFor={label + '-field'}>
          <span className={twMerge('font-semibold text-sm')}>{label}</span>
        </label>
      )}

      <Listbox value={selectedOptionValue} onChange={handleChange}>
        {({ open }) => (
          <div className="relative w-full">
            <Listbox.Button
              style={{ height: sizes[size] }}
              className={twMerge(
                'relative w-full bg-bg-main border-2 border-primary cursor-default rounded pl-3 pr-10 text-left focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary',
                className
              )}
            >
              <span className="block truncate">{options.find((o) => o.value === selectedOptionValue)?.label}</span>
              {showIcon && (
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectIcon className={twMerge('h-5 w-5', open && 'rotate-180')} aria-hidden="true" />
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
                  showAbove ? 'mb-1 bottom-full' : 'mt-1 top-full',
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
                        `relative cursor-default select-none py-2 px-4 ${
                          active ? 'bg-secondary text-white' : 'text-primary'
                        }`
                      }
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
    </fieldset>
  );
};

export default Select;
