import { Control, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type PropsMUI = Omit<TextFieldProps, 'error'> & {
  error?: string;
};

export const InputMUI = ({ error, ...rest }: PropsMUI) => (
  <TextField variant="outlined" size="small" fullWidth error={!!error} {...rest} helperText={error || null} />
);

type ControlledPropsMUI = Omit<PropsMUI, 'name'> & {
  name: string;
  control: Control<any>;
};

export const ControlledInputMUI = ({ control, name, ...rest }: ControlledPropsMUI) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <InputMUI error={error?.message} onChange={onChange} value={value} {...rest} />
    )}
  />
);
