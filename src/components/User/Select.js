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

const DEBOUNCE_MS = 500

const UserSelect = ({ user, setUser }) => {
	const [searchText, setSearchText] = useState('');
	const [debouncedSearchText, setDebouncedSearchText] = useState('');
	const [isLoading, setIsLoading] = useState(false);


	// Menggunakan setTimeout untuk mendebounce input
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedSearchText(searchText);
		}, DEBOUNCE_MS);

		return () => clearTimeout(timeoutId);
	}, [searchText]);




	const fetchUserOptions = async (searchUrl) => {
		setIsLoading(true);

		const response = await axios.get(searchUrl);
		const data = response.data;

		setIsLoading(false);

		return data;
	};



	const { data: userOptionsData } = useSWR(
		debouncedSearchText.length >= 3 ? `/users/search?query=${debouncedSearchText}` : null,
		fetchUserOptions
	);

	useEffect(() => {
		const userIndexOnOptions = (userOptionsData || []).findIndex((u) => u.id === user?.id);

		if (user?.id && userIndexOnOptions === -1) userOptionsData.unshift(user);
		if (user?.id && userIndexOnOptions !== -1) userOptionsData[userIndexOnOptions] = user;
	}, [user]);




	return (
		<Autocomplete
			componentsProps={{
				paper: {
					elevation: 8,
				}
			}}
			options={userOptionsData || []}
			value={user}
			getOptionLabel={(user) => user.name}
			onChange={(event, newValue) => setUser(newValue)}
			noOptionsText="Pengguna tidak ditemukan"
			loadingText="Memuat..."
			filterOptions={(x) => x}
			loading={isLoading}
			placeholder='Cari Pengguna'
			renderOption={(props, option) => (
				<li {...props} key={option.id}>
					<Box display='flex' alignItems='center'>
						<Typography mr={2}>
							{option.name}
						</Typography>
						<Typography mr={2} variant='caption'>
							{option.employee?.code || option.member?.code || option.courier?.code}
						</Typography>

						{
							option.employee?.is_active && <Chip size='small' label="Pegawai" />
						}

						{
							option.member?.is_active && <Chip size='small' label="Anggota" />
						}

						{
							option.courier?.is_active && <Chip size='small' label="Kurir" />
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