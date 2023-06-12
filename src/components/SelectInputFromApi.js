"use client";

import { useState } from 'react';
import axios from '@/lib/axios';
import useSWR from 'swr';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export default function SelectInputFromApi({ endpoint, value = '', name, label, onChange, ...props }) {
	const [internalValue, setInternalValue] = useState(value);

	const fetcher = async url => {
		return (await axios.get(url)).data;
	}

	const { data } = useSWR(endpoint, fetcher);

	if (!data) return;

	return (
		<FormControl
			fullWidth
			margin="normal"
			{...props}
		>
			<InputLabel>{label}</InputLabel>
			<Select
				value={internalValue}
				name={name}
				onChange={e => {
					setInternalValue(e.target.value);
					if (onChange) {
						onChange(e);
					}
				}}
				label={label}
			>
				<MenuItem value="" disabled></MenuItem>
				{
					data?.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
				}
			</Select>
		</FormControl>
	)
}