import { IconX } from '@tabler/icons-react';

type Props = {
  value: boolean;
  onChange: () => void;
  text: string;
};

const Checkbox = ({ value, onChange, text }: Props) => {
  return (
    <label className="flex cursor-pointer items-center gap-5" onClick={onChange}>
      <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-tertiary">
        {value && (
          <span>
            <IconX width={16} height={16} className="stroke-tertiary" />
          </span>
        )}
      </div>
      <span className="text-sm font-semibold">{text}</span>
    </label>
  );
};

export default Checkbox;
