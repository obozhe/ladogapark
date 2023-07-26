import Button, { ButtonProps } from 'ui/Button';
import { random } from 'lodash';
import Tooltip from 'ui/Tooltip';

type Props = ButtonProps & {
  title: string;
  request: () => Promise<any>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionIconButton = ({ title, disabled, children, request, setLoading, color = 'primary', ...rest }: Props) => {
  return (
    <Tooltip id={`${title}_${random()}`} content={title}>
      <Button
        {...rest}
        isIconButton
        color={color}
        disabled={disabled}
        onClick={() => {
          if (setLoading) {
            setLoading(true);
          }

          request().finally(() => setLoading && setLoading(false));
        }}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default ActionIconButton;
