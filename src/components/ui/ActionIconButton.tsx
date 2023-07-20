import Button, { ButtonProps } from 'ui/Button';
import { random } from 'lodash';
import { Tooltip } from 'react-tooltip';

type Props = ButtonProps & {
  title: string;
  request: () => Promise<any>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionIconButton = ({ title, disabled, children, request, setLoading, color = 'primary', ...rest }: Props) => {
  const tooltipId = `${title}_${random()}`;
  return (
    <>
      <Button
        data-tooltip-id={tooltipId}
        data-tooltip-content={title}
        data-tooltip-place="top"
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
      <Tooltip id={tooltipId} />
    </>
  );
};

export default ActionIconButton;
