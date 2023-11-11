type Props<T> = {
  items: { label: string; id: T }[];
  onChange: (id: T) => void;
  value: string;
};

const RadioButtons = <T extends string>({ items, onChange, value }: Props<T>) => {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        return (
          <div onClick={() => onChange(item.id)} key={item.id} className="flex cursor-pointer items-center gap-5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-tertiary">
              {value === item.id && <div className="h-[10px] w-[10px] rounded-full bg-tertiary"></div>}
            </div>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default RadioButtons;
