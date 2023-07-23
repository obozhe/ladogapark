type Props = {
  title: string;
  titleComponent?: JSX.Element;
  children: JSX.Element | JSX.Element[];
};

export default function Card({ children, title, titleComponent }: Props) {
  return (
    <div className="w-full h-fit bg-white p-4 rounded">
      <div className="w-full flex justify-between items-center border-b pb-2">
        <h3>{title}</h3>
        <div>{titleComponent || ''}</div>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}
