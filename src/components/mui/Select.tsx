// import * as React from 'react';
// import { Control, Controller } from 'react-hook-form';
// import { Autocomplete, CircularProgress, FormHelperText, TextField, Typography } from '@mui/material';
// import Checkbox from '@mui/material/Checkbox';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import ListItemText from '@mui/material/ListItemText';
// import MenuItem from '@mui/material/MenuItem';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Select, { SelectChangeEvent } from '@mui/material/Select';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// type Props = {
//   label: string;
//   options: Option[];
//   value?: Option[];
//   error?: string;
//   onChange?: (event: SelectChangeEvent<Option[]>, child: React.ReactNode) => void;
// };

// export default function MultipleSelectMUI({ label, options, value, error, onChange }: Props) {
//   const handle = (event: SelectChangeEvent<Option[]>, child: React.ReactNode) => {
//     console.log(event.target.value);
//     onChange && onChange(event, child);
//   };
//   return (
//     <div>
//       <FormControl sx={{ m: 1, width: 300 }}>
//         <InputLabel id="select">{label}</InputLabel>
//         <Select<Option[]>
//           labelId="select"
//           multiple
//           property="id"
//           value={value}
//           onChange={handle}
//           input={<OutlinedInput label={label} error={!!error} />}
//           renderValue={(selected) => selected.map(({ value }) => value).join(',')}
//           MenuProps={MenuProps}
//         >
//           {options.map((option) => (
//             //@ts-ignore
//             <MenuItem key={option.id} value={option}>
//               <Checkbox checked={value ? value.findIndex(({ id }) => id === option.id) > -1 : false} />
//               <ListItemText primary={option.value} />
//             </MenuItem>
//           ))}
//         </Select>
//         <FormHelperText error={!!error}>{error}</FormHelperText>
//       </FormControl>
//     </div>
//   );
// }

// type ControlledProps = Omit<Props, 'name'> & {
//   name: string;
//   control: Control<any>;
// };

// export const ControlledMultipleSelectMUI = ({ control, name, ...rest }: ControlledProps) => (
//   <Controller
//     name={name}
//     control={control}
//     render={({ field: { onChange, value }, fieldState: { error } }) => (
//       <MultipleSelectMUI {...rest} error={error?.message} onChange={onChange} value={value} />
//     )}
//   />
// );
