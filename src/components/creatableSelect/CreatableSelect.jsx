//Component for creating new options if it doesn't exist in existing array

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {useState} from "react";

const CreatableSelect = ({...props}) => {
	let optionArray = [...props.options];
	optionArray.splice(0,1);
	const filter = createFilterOptions();

	const [selectedValue, setSelectedValue] = useState(props.value || null);

	return (
		<Autocomplete
			value={selectedValue}
			onChange={(event, newValue) => {
				if(newValue !== null && newValue.indexOf("Add ") === 0) {
					newValue = newValue.split("\"")[1];
				}
				setSelectedValue(newValue);
				props.onChange(newValue);
			}}
			filterOptions={(options, params) => {
				const filtered = filter(options, params);
				const { inputValue } = params;
				// Suggest the creation of a new value
				const isExisting = options.some((option) => inputValue === option);
				if (inputValue !== '' && !isExisting) {
					filtered.push(`Add "${inputValue}"`);
				}
				return filtered;
			}}
			onBlur={() => {
				props.onBlur(selectedValue);
			}}
			selectOnFocus
			clearOnBlur
			handleHomeEndKeys
			id={props.id}
			options={optionArray}
			getOptionLabel={(option) => {
				if(option.indexOf("Add ") === 0) {
					return option.split("\"")[1];
				}
				return option;
			}}
			renderOption={(props, option) => <li {...props}>{option}</li>}
			sx={{ width: "100%" }}
			freeSolo
			renderInput={(params) => (
				<TextField {...params} label={props.label} error={props.error} helperText={props.helperText}/>
			)}
		/>
	);
};

export default CreatableSelect;