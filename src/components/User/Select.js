"use client";

import { useEffect, useState } from 'react';
import useSWR from 'swr';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import axios from '@/lib/axios';

const UserSelect = ({ user, setUser }) => {
	const [searchText, setSearchText] = useState('');
	const [submittedSearchText, setSubmittedSearchText] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const fetchUserOptions = async (searchUrl) => {
		setIsLoading(true);

		const response = await axios.get(`${searchUrl}?query=${submittedSearchText}`);
		const data = response.data;

		setIsLoading(false);

		return data;
	};

	useEffect(() => {
		mutate();
	}, [submittedSearchText]);


	const { data: userOptionsData, mutate } = useSWR(
		submittedSearchText.length >= 3 ? `/users/search` : null,
		fetchUserOptions
	);

	return (
		<Autocomplete
			componentsProps={{
				paper: {
					elevation: 8,
				}
			}}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			options={userOptionsData || []}
			value={user}
			getOptionLabel={(user) => user.name}
			onChange={(event, newValue) => setUser(newValue)}
			onKeyDown={(e) => e.key === 'Enter' ? setSubmittedSearchText(searchText) : null}
			noOptionsText="Pengguna tidak ditemukan"
			loadingText="Memuat..."
			filterOptions={(x) => x}
			loading={isLoading}
			placeholder='Cari Pengguna'
			renderOption={(props, option) => (
				<li {...props} key={option.id}>
					<Box display='flex' alignItems='center'>
						<Typography mr={1} variant='caption'>
							{option.id}
						</Typography>
						<Typography mr={2}>
							{option.name}
						</Typography>

						{
							option.is_employee?.is_active && <Chip size='small' label="Pegawai" />
						}

						{
							option.is_member?.is_active && <Chip size='small' label="Anggota" />
						}

						{
							option.is_courier?.is_active && <Chip size='small' label="Kurir" />
						}
					</Box>
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Cari Pengguna"
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{isLoading && <CircularProgress color="inherit" size={20} />}
								{params.InputProps.endAdornment}
							</>
						),
					}}
				/>
			)}
		/>
	);
};

export default UserSelect;