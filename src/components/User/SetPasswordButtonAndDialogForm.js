"use client";

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import LoadingCenter from '../Statuses/LoadingCenter';
import CompleteCenter from '../Statuses/CompleteCenter';
import ErrorCenter from '../Statuses/ErrorCenter';
import axios from '@/lib/axios';

const EMPTY_PASSWORDS_DATA = {
	new_password: '',
	new_password_confirmation: ''
};

export default function SetPasswordButtonAndDialogForm({ data: user, isLoading: isDataLoading }) {
	const [isOpen, setIsOpen] = useState(false);
	const [validationErrors, setValidationErrors] = useState([]);

	const [isComplete, setIsComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(undefined);

	const [passwordsData, setPasswordsData] = useState(EMPTY_PASSWORDS_DATA)

	useEffect(() => {
		if (isOpen === false) {
			setValidationErrors([]);
			setIsComplete(false);
			setIsLoading(false);
			setError(undefined);
			setPasswordsData(EMPTY_PASSWORDS_DATA);
		}
	}, [isOpen]);

	if (!user && !isDataLoading) return null;

	const isSubmitDisabled = () =>
		validationErrors.new_password !== undefined ||
		validationErrors.new_password_confirmation !== undefined ||
		isLoading ||
		passwordsData.new_password === '' ||
		passwordsData.new_password_confirmation === '';

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);

		try {
			await axios.put(`/users/${user.uuid}/set-password`, passwordsData);

			setIsComplete(true);
		} catch (error) {
			if (error.response?.status === 422) {
				setValidationErrors(error.response.data.errors);
			} else {
				setError(error.response?.data.message);
			}
		}

		setIsLoading(false);
	};

	const validateInputs = (name, value) => {
		let error = undefined;

		if (value.length !== 0 && value.length < 8) {
			error = 'Kata sandi minimal 8 karakter';
		}

		if (name === 'new_password_confirmation' && value !== passwordsData.new_password) {
			error = 'Kata sandi tidak sama';
		}

		setValidationErrors({
			...validationErrors,
			[name]: error
		});
	}


	const handleChange = (e) => {
		const { name, value } = e.target

		validateInputs(name, value);

		setPasswordsData({
			...passwordsData,
			[name]: value
		})
	}

	return (
		<>
			<Button
				disabled={isDataLoading || user.is_active === false}
				variant="outlined"
				color='error'
				size="small"
				onClick={() => setIsOpen(true)}
			>
				Atur kata sandi
			</Button>

			{
				!isDataLoading && <Dialog fullWidth
					maxWidth="xs" open={isOpen} onKeyDown={e =>
						e.key === 'Escape' && setIsOpen(false)
					}>

					<DialogContent>
						<Box display='flex' mb={1.5} alignItems='center'>
							<KeyIcon color='warning' />
							<Typography variant='h6' component='h2' ml={1} flexGrow={1}>
								Pengaturan kata sandi
							</Typography>

							<IconButton disabled={isLoading} onClick={() => setIsOpen(false)}>
								<CloseIcon />
							</IconButton>
						</Box>



						<CompleteCenter sx={{
							display: isComplete ? 'block' : 'none'
						}} message={`Kata sandi akun ${user.name} berhasil diubah`} />

						<LoadingCenter sx={{
							display: isLoading ? 'block' : 'none'
						}} />

						<ErrorCenter sx={{
							display: error ? 'block' : 'none'
						}} message={error} onClose={() => setError(undefined)} />

						<Box sx={{
							display: isComplete || isLoading || error ? 'none' : 'block'
						}}>
							<DialogContentText>
								Pastikan Anda mengatur kata sandi yang aman untuk akun <strong>{user.name}</strong>.
							</DialogContentText>
							<form
								id="set_password_form"
								onSubmit={handleSubmit}
							>
								<TextField
									margin="dense"
									name="new_password"
									label="Kata sandi baru"
									type="password"
									fullWidth
									onChange={handleChange}

									error={Boolean(validationErrors.new_password)}
									helperText={validationErrors.new_password}
								/>

								<TextField
									margin="dense"
									name="new_password_confirmation"
									label="Ulangi kata sandi baru"
									type="password"
									fullWidth
									onChange={handleChange}

									error={Boolean(validationErrors.new_password_confirmation)}
									helperText={validationErrors.new_password_confirmation}
								/>
							</form>
						</Box>
					</DialogContent>

					{
						!isComplete && <DialogActions>
							<Button color="warning" disabled={isSubmitDisabled()} type='submit' form="set_password_form">Simpan</Button>
						</DialogActions>
					}

				</Dialog>
			}
		</>
	)
}

