import { error } from 'console';
import { SyntheticEvent, useState } from 'react';
import { Option } from 'core/types/Option';
import Autocomplete, { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

type Props = {
  label: string;
  options: Option[];
  onChange: (value: Option[]) => void;
  value: Option[];
  error?: string;
};

export const AutoCompleteMUI = ({ label, options, error, value, onChange }: Props) => {
  const handleChange = (_: SyntheticEvent<Element, Event>, value: Option[]) => {
    onChange(value);
  };

  return (
    <Autocomplete
      multiple
      options={options}
      onChange={handleChange}
      openOnFocus
      value={value}
      disableCloseOnSelect
      noOptionsText="Нет опций"
      renderTags={(value) => {
        const numTags = value.length;
        return (
          <div className="grid grid-flow-col w-full">
            <div className="truncate">
              {value
                .slice(0, 1)
                .map((option) => option.value)
                .join(', ')}
            </div>
            <div>{numTags > 1 && ` + еще ${numTags - 1}`}</div>
          </div>
        );
      }}
      isOptionEqualToValue={(option: Option, value: Option) => option.id === value.id}
      getOptionLabel={(option) => option.value}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {option.value}
        </li>
      )}
      fullWidth
      renderInput={(params) => <TextField {...params} label={label} size="small" error={!!error} helperText={error} />}
    />
  );
};
