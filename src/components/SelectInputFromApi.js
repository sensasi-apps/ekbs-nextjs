"use client";

import { useState } from 'react';
import axios from '@/lib/axios';
import useSWR from 'swr';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import LoadingCenter from './Statuses/LoadingCenter';


export default function SelectInputFromApi({ endpoint, name, label, onChange, selectProps, ...props }) {

	const fetcher = async url => {
		return (await axios.get(url)).data;
	}

	const { data, isLoading } = useSWR(endpoint, fetcher);

	if (isLoading) return <LoadingCenter />;

	return (
		<FormControl
			fullWidth
			margin="normal"
			{...props}
		>
			<InputLabel>{label}</InputLabel>
			<Select
				name={name}
				onChange={e => {
					if (onChange) {
						onChange(e);
					}
				}}
				label={label}
				{...selectProps}
			>
				<MenuItem value="" disabled></MenuItem>
				{
					data?.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
				}
			</Select>
		</FormControl>
	)
}