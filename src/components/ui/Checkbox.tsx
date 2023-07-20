import { useEffect, useRef } from 'react';

export enum CheckboxStates {
    Checked = 'Checked',
    Indeterminate = 'Indeterminate',
    Empty = 'Empty',
}

type Props = {
    isDisabled?: boolean;
    value: CheckboxStates;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Checkbox = ({ value, isDisabled, onChange }: Props) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!checkboxRef.current) {
            return;
        }

        if (value === CheckboxStates.Checked) {
            checkboxRef.current.checked = true;
            checkboxRef.current.indeterminate = false;
        } else if (value === CheckboxStates.Empty) {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = false;
        } else if (value === CheckboxStates.Indeterminate) {
            checkboxRef.current.checked = false;
            checkboxRef.current.indeterminate = true;
        }
    }, [value]);

    return (
        <label>
            <input ref={checkboxRef} type="checkbox" onChange={onChange} disabled={isDisabled} />
        </label>
    );
};

export default Checkbox;
