"use client";

{/* TODO: set role and permission */ }

import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import axios from '@/lib/axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import LoadingCenter from '../Statuses/LoadingCenter';
import ErrorCenter from '../Statuses/ErrorCenter';

const DEFAULT_NEW_USER = {
	name: null,
	email: null,
	citizenship_id: null,
	gender_id: null,
	is_active: false
}

export default function UserForm({
	data: user,
	onClose,
	...props
}) {
	const router = useRouter();
	const [userDraft, setUserDraft] = useState(user || DEFAULT_NEW_USER);
	const [errors, setErrors] = useState([]);
	const [statusTitle, setStatusTitle] = useState(null);

	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setUserDraft(user || DEFAULT_NEW_USER);
	}, [user]);

	const handleChange = (event) => {

		setErrors({
			...errors,
			[event.target.name]: null
		});

		const { name, value, type, checked } = event.target;

		const newUserDraft = structuredClone(userDraft);
		let newValue = value;

		if (type === 'checkbox') newValue = checked;

		if (name === 'email' && newValue) newUserDraft.is_active = true;
		if (name === 'email' && !newValue) newUserDraft.is_active = false;

		newUserDraft[name] = newValue;

		return setUserDraft(newUserDraft);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		setIsLoading(true);

		try {
			if (userDraft.uuid) {
				await axios.put(`/users/${userDraft.uuid}`, userDraft);
				await mutate(`/users/${userDraft.uuid}`);
			} else {
				const { data } = await axios.post('/users', userDraft);
				router.push(`/users/${data.uuid}`);
			}

			if (onClose) onClose();
		} catch (error) {

			if (error.response && error.response.status === 422) {
				setErrors(error.response.data.errors);
			} else {
				setIsError(true);
				setStatusTitle(`Terjadi kesalahan: ${error.message}`);
			}
		}

		setIsLoading(false);
	};



	if (isError) return <ErrorCenter message={statusTitle} onClose={() => setIsError(false)} />
	if (isLoading) return <LoadingCenter />

	return (
		<form {...props} onSubmit={handleSubmit}>
			<TextField
				name="name"
				label="Nama"
				value={userDraft.name || ''}
				onChange={handleChange}
				fullWidth
				required
				margin="normal"
				error={Boolean(errors.name)}
				helperText={errors.name}
			/>

			<TextField
				name="email"
				label="Email"
				type='email'
				value={userDraft.email || ''}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={Boolean(errors.email)}
				helperText={errors.email}
			/>

			<FormControl
				fullWidth
				disabled={!Boolean(userDraft.email)}
				margin='normal'
				error={Boolean(errors.is_active)}
			>
				<FormLabel>Status Akun</FormLabel>
				<FormControlLabel
					onChange={handleChange}
					sx={{
						color: userDraft.is_active ? 'success.light' : 'text.secondary'
					}}
					label={userDraft.is_active ? 'Aktif' : 'Nonaktif'}
					control={
						<Switch
							color='success'
							name="is_active"
							checked={userDraft.is_active || false} />
					}
				/>

				{
					Boolean(errors.is_active) && <FormHelperText>
						{errors.is_active}
					</FormHelperText>
				}
			</FormControl>

			<Box display='flex' justifyContent='end'>
				<Button variant="text" onClick={onClose}>
					Batal
				</Button>
				<Button type="submit" variant="text">
					Simpan
				</Button>
			</Box>
		</form>
	);
};