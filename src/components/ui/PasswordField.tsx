import { Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { ForwardedRef, InputHTMLAttributes, useState } from 'react';
import Button from './Button';
import { Input } from './Input';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
  name: string;
};

const PasswordField = React.forwardRef((props: Props, ref: ForwardedRef<HTMLInputElement | null>) => {
  const [isPasswordVisible, togglePasswordVisibility] = useState(false);

  return (
    <Input
      {...props}
      ref={ref}
      type={isPasswordVisible ? 'text' : 'password'}
      autoComplete="off"
      endAdornment={
        <Button
          isIconButton
          size="xs"
          aria-label="toggle password visibility"
          onClick={() => togglePasswordVisibility(!isPasswordVisible)}
        >
          {isPasswordVisible ? <EyeOff /> : <Eye />}
        </Button>
      }
    />
  );
});

PasswordField.displayName = 'PasswordField';
export default PasswordField;
