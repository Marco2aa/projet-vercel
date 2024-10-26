import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography } from '@mui/material';

export default function AutocompleteHint({ options, label, id, onChange }) {
  const [value, setValue] = React.useState(null);

  const handleAutocompleteChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  }
  return (
    <Autocomplete
      getOptionLabel={(option) => option.name.toUpperCase()}
      renderOption={(props, option) => (
        <li {...props}>
          <Box key={option.id} sx={{ display: 'flex', alignItems: 'center' }}>
            {option.image && (
              <img src={option.image} alt={option.id} style={{
                marginRight: 1,
                height: 24,
                width: 24
              }} />
            )}
            {option.name.toUpperCase()}
          </Box>
        </li>
      )}
      value={value}
      onChange={handleAutocompleteChange}
      filterOptions={(options, state) => {
        const displayOptions = options.filter((option) =>
          option.name.toLowerCase().trim().includes(state.inputValue.toLowerCase().trim()),
        );
        return displayOptions;
      }}
      id={id}
      options={options}
      sx={{ width: '70%' }}
      ListboxProps={{
        style: {
          maxHeight: 200,
          overflowY: 'auto',
        },
      }}
      renderInput={(params) => {
        return (
          <Box sx={{ position: 'relative' }}>
            <TextField
              {...params}
              label={label}
            />
          </Box>
        );
      }}
    />
  );
}
