import { Check, ChevronsUpDown } from 'lucide-react';
import { Fragment, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Size, sizes } from 'core/enums/ui-sizes';
import { Listbox, Transition } from '@headlessui/react';

type Value = string | number;

type Option = { label: string; value: Value };

type Props = {
  label?: string;
  value: Value;
  onChange: (value: Value) => void;
  options: Option[];
  fullWidth?: boolean;
  showAbove?: boolean;
  size?: Size;
};

const Select = ({ label, options, value, fullWidth, showAbove, onChange, size = 'lg' }: Props) => {
  const [selectedOptionValue, setSelectedOptionValue] = useState(value);

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
        <div className="relative w-full">
          <Listbox.Button
            style={{ height: sizes[size] }}
            className="relative w-full bg-bg-main border-3 border-primary cursor-default rounded pl-3 pr-10 text-left focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          >
            <span className="block truncate">{options.find((o) => o.value === selectedOptionValue)?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
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
                'absolute z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                showAbove ? 'mb-1 bottom-full' : 'mt-1 top-full'
              )}
            >
              {options.map((option, index) => (
                <Listbox.Option
                  key={`${label}_${option.value}_${index}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </fieldset>
  );
};

export default Select;
