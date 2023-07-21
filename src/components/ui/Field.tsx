type Props = {
  label: string;
  value: string | number | JSX.Element;
};

export default function Field({ value, label }: Props) {
  return (
    <div className="grid grid-cols-2">
      <div className="text-gray-500">{label}</div>
      <div>{value}</div>
    </div>
  );
}
