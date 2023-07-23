type Props = {
  label: string;
  value: string | number | JSX.Element;
  rightAlignment?: boolean;
};

export default function Field({ value, label, rightAlignment }: Props) {
  return (
    <div className="grid grid-cols-2">
      <div className="text-gray-500">{label}</div>
      <div className={rightAlignment ? 'text-right' : ''}>{value}</div>
    </div>
  );
}
