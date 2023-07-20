// import dayjs, { Dayjs } from 'dayjs';
// import { getSelectOptions } from 'helpers/date';
// import { useDidUpdateEffect } from 'hooks/useDidUpdateEffect';
// import { useState } from 'react';

// import Input from './Input';
// import Select from './Select';

// type Props = {
//     value: Dayjs;
//     showTimeSelection?: boolean;
//     className?: string;
//     onChange: (date: Dayjs) => void;
// };

// const selects: { name: 'day' | 'month' | 'year'; label: string }[] = [
//     {
//         name: 'day',
//         label: 'Day',
//     },
//     {
//         name: 'month',
//         label: 'Month',
//     },
//     {
//         name: 'year',
//         label: 'Year',
//     },
// ];

// const DateSelects = ({ value, onChange, showTimeSelection = false, className = '' }: Props) => {
//     const date = value || dayjs();

//     const [data, setData] = useState({
//         day: date.date(),
//         month: date.month() + 1,
//         year: date.year(),
//         time: date.format('HH:mm'),
//     });

//     const updateField = (name: string, newValue: string | number) =>
//         setData((state) => ({ ...state, [name]: newValue }));

//     useDidUpdateEffect(() => {
//         const selectedMonthDaysCount = dayjs(`${data.year}-${data.month}`).daysInMonth();
//         if (data.day > selectedMonthDaysCount) {
//             updateField('day', selectedMonthDaysCount);
//         } else {
//             const { year, month, day, time } = data;
//             onChange(dayjs(`${year}-${month}-${day} ${time}`));
//         }
//     }, [data]);

//     return (
//         <>
//             <div className={`flex flex-col md:flex-row gap-5 ${className}`}>
//                 {selects.map(({ name, label }, i) => (
//                     <Select
//                         key={`${label}_${i}`}
//                         label={label}
//                         value={data[name]}
//                         onChange={(optionValue) => updateField(name, optionValue as number)}
//                         options={getSelectOptions(date, name)}
//                         fullWidth
//                     />
//                 ))}
//             </div>
//             {showTimeSelection && (
//                 <Input
//                     label="Time"
//                     type="time"
//                     value={data.time}
//                     onChange={(e) => updateField('time', e.target.value)}
//                     disableHelper
//                 />
//             )}
//         </>
//     );
// };
// export default DateSelects;
