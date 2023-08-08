import { Control, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type Props = Omit<TextFieldProps, 'error'> & {
  error?: string;
};

export const InputMUI = ({ error, ...rest }: Props) => (
  <TextField variant="outlined" size="small" fullWidth error={!!error} {...rest} helperText={error || null} />
);

type ControlledProps = Omit<Props, 'name'> & {
  name: string;
  control: Control<any>;
};

export const ControlledInputMUI = ({ control, name, ...rest }: ControlledProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <InputMUI error={error?.message} onChange={onChange} value={value} {...rest} />
    )}
  />
);
