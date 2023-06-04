"use client"

import { useState } from 'react';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import DatePicker from '../DatePicker';
import axios from '@/lib/axios';
import moment from 'moment';

import LoadingCenter from '../Statuses/LoadingCenter';
import CompleteCenter from '../Statuses/CompleteCenter';
import ErrorCenter from '../Statuses/ErrorCenter';

const defaultNewUser = {
	name: null,
	email: null,
	citizenship_id: null,
	gender_id: null,
	is_active: true
}

const defaultNewEmployee = {
	code: null,
	joined_at: null
}

const defaultNewMember = {
	code: null,
	joined_at: null
}

const defaultNewCourier = {
	code: null,
	joined_at: null
}

export default function UserForm({ user,
	setUser,
	isLoading,
	setIsLoading
}) {

	const [userDraft, setUserDraft] = useState(user || defaultNewUser);
	const [errors, setErrors] = useState([]);
	const [isComplete, setIsComplete] = useState(false);
	const [isError, setIsError] = useState(false);
	const [statusTitle, setStatusTitle] = useState(null);

	const handleJoinedAtEmployeeChange = value => setUserDraft({
		...userDraft,
		employee: {
			...userDraft.employee || defaultNewEmployee,
			joined_at: value?.format('YYYY-MM-DD') || null
		}
	})

	const handleJoinedAtMemberChange = value => setUserDraft({
		...userDraft,
		member: {
			...userDraft.member || defaultNewMember,
			joined_at: value?.format('YYYY-MM-DD') || null
		}
	})

	const handleJoinedAtCourierChange = value => setUserDraft({
		...userDraft,
		courier: {
			...userDraft.courier || defaultNewCourier,
			joined_at: value?.format('YYYY-MM-DD') || null
		}
	})

	const handleChange = (event) => {
		// Hapus pesan kesalahan jika ada
		setErrors({
			...errors,
			[event.target.name]: null
		});

		// userDraft preprocessor
		const { name, value, type, checked } = event.target;

		let newValue = value;

		if (newValue === 'true' || newValue === 'false') newValue = newValue === 'true';

		if (type === 'checkbox') {
			newValue = checked;
		}

		const newUserDraft = structuredClone(userDraft);

		if (name.includes('.')) {
			const childName = name.split('.')[0];
			const childKey = name.split('.')[1];

			if (!newUserDraft[childName]) {
				newUserDraft[childName] = {};
			}

			newUserDraft[childName][childKey] = newValue;
		} else {
			newUserDraft[name] = newValue;
		}

		return setUserDraft(newUserDraft);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		setIsLoading(true);

		try {
			let response;
			if (userDraft.id) {
				response = await axios.put(`/users/${userDraft.id}`, userDraft);
			} else {
				response = await axios.post('/users', userDraft);
			}

			const { data } = response;

			setStatusTitle(`Data pengguna berhasil ${userDraft.id ? 'disimpan' : 'ditambahkan'}!`);
			setUser(data);
			setIsComplete(true);

		} catch (error) {
			setIsError(true);

			// Tangani kesalahan jika payload tidak diterima oleh backend
			if (error.response) {
				// Mendapatkan data kesalahan dari tanggapan server
				const { data, status } = error.response;

				if (status === 422) {
					setIsError(false);
					setErrors(data.errors);
				}

				setStatusTitle(`Terjadi kesalahan: ${data.message}`);

			} else if (error.request) {
				// Kesalahan koneksi
				setStatusTitle(`Kesalahan koneksi: ${error.message}`);

			} else {
				// Kesalahan lainnya
				setStatusTitle(`Kesalahan lainnya: ${error.message}`);

			}

		}

		setIsLoading(false);
	};

	if (isError) return <ErrorCenter title={statusTitle} setIsError={setIsError} />
	if (isLoading) return <LoadingCenter />
	if (isComplete) return <CompleteCenter title={statusTitle} />

	return (
		<form onSubmit={handleSubmit}>

			<SubsectionTitle title='Biodata' />

			<UserFields
				user={userDraft}
				handleChange={handleChange}
				errors={errors}
			/>

			{
				userDraft.employee?.is_active && <>
					<NewSectionDivider title="Data Pegawai" />

					<EmployeeFields
						employee={userDraft?.employee}
						handleChange={handleChange}
						handleJoinedAtEmployeeChange={handleJoinedAtEmployeeChange}
						errors={errors}
					/>
				</>
			}

			{
				userDraft.member?.is_active && <>
					<NewSectionDivider title="Data Anggota" />
					<MemberFields
						member={userDraft?.member}
						handleChange={handleChange}
						handleJoinedAtMemberChange={handleJoinedAtMemberChange}
						errors={errors}
					/>
				</>
			}

			{
				userDraft.courier?.is_active && <>
					<NewSectionDivider title="Data Pengantar" />
					<CourierFields
						courier={userDraft.courier}
						handleChange={handleChange}
						handleJoinedAtCourierChange={handleJoinedAtCourierChange}
						errors={errors}
					/>
				</>
			}

			<Button sx={{ mt: 4 }} type="submit" variant="contained">
				Simpan
			</Button>
		</form>
	);
};

function NewSectionDivider({ title }) {
	return (
		<>
			{/* <Divider sx={{ my: 2 }} /> */}
			<SubsectionTitle title={title} />
		</>
	)
}

function SubsectionTitle({ title }) {
	return (
		<Typography mt={3} align='center' fontSize='1.3rem' variant='overline' component='h3'>
			{title}
		</Typography>
	)
}

function UserFields({ user, handleChange, errors }) {
	return (
		<>
			<TextField
				name="citizenship_id"
				label="Nomor Induk Kependudukan"
				value={user.citizenship_id || ''}
				onChange={handleChange}
				fullWidth
				margin="normal"
				error={Boolean(errors.citizenship_id)}
				helperText={errors.citizenship_id}
			/>

			<TextField
				name="name"
				label="Nama"
				value={user.name || ''}
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
				value={user.email || ''}
				onChange={handleChange}
				fullWidth
				required
				margin="normal"
				error={Boolean(errors.email)}
				helperText={errors.email}
			/>

			<FormControl
				fullWidth
				margin='normal'
				error={Boolean(errors.gender_id)}
			>
				<FormLabel>Jenis Kelamin</FormLabel>

				<RadioGroup
					name="gender_id"
					onChange={handleChange}
					value={user.gender_id}
				>
					<FormControlLabel control={<Radio value={1} />} label="Laki-laki" />
					<FormControlLabel control={<Radio value={2} />} label="Perempuan" />
				</RadioGroup>

				{
					Boolean(errors.gender_id) && <FormHelperText>
						{errors.gender_id}
					</FormHelperText>
				}

			</FormControl>

			<FormControl
				fullWidth
				margin='normal'
				error={Boolean(errors.is_active)}
			>
				<FormLabel>Status Pengguna</FormLabel>
				<FormControlLabel
					onChange={handleChange}
					label={user.is_active ? 'Aktif' : 'Nonaktif'}
					control={
						<Switch
							name="is_active"
							checked={user.is_active} />
					}
				/>

				{
					Boolean(errors.is_active) && <FormHelperText>
						{errors.is_active}
					</FormHelperText>
				}
			</FormControl>

			<FormControl
				fullWidth
				margin='normal'
				error={
					Boolean(errors['employee.is_active']) ||
					Boolean(errors['member.is_active']) ||
					Boolean(errors['courier.is_active'])
				}
			>
				<FormLabel>Informasi Lain</FormLabel>
				<FormControlLabel control={<Switch name="employee.is_active" checked={user.employee?.is_active || false} onChange={handleChange} />} label="Pegawai" />

				{
					Boolean(errors['employee.is_active']) && <FormHelperText>
						{errors['employee.is_active']}
					</FormHelperText>
				}

				<FormControlLabel control={<Switch name="member.is_active" checked={user.member?.is_active || false} />} onChange={handleChange} label="Anggota" />

				{
					Boolean(errors['member.is_active']) && <FormHelperText>
						{errors['member.is_active']}
					</FormHelperText>
				}

				<FormControlLabel control={<Switch name="courier.is_active" checked={user.courier?.is_active || false} />} onChange={handleChange} label="Pengantar" />

				{
					Boolean(errors['courier.is_active']) && <FormHelperText>
						{errors['courier.is_active']}
					</FormHelperText>
				}


			</FormControl>

			{/* TODO: set role and permission */}
			{/* TODO: set socmed */}
		</>
	)
}

function EmployeeFields({ employee, handleChange, handleJoinedAtEmployeeChange, errors }) {

	return (
		<>
			<TextField
				name="employee.code"
				label="Kode Pegawai"
				value={employee?.code || ''}
				onChange={handleChange}
				fullWidth
				required
				margin="normal"
				error={Boolean(errors['employee.code'])}
				helperText={errors['employee.code']}
			/>

			<DatePicker
				required
				fullWidth
				onChange={handleJoinedAtEmployeeChange}
				label="Tanggal Bergabung"
				value={employee?.joined_at ? moment(employee?.joined_at) : null}
				margin='normal'
				error={Boolean(errors['employee.joined_at'])}
				helperText={errors['employee.joined_at']}
			/>
		</>
	)
}

function MemberFields({ member, handleChange, handleJoinedAtMemberChange, errors }) {
	return (
		<>
			<FormControl
				fullWidth
				margin='normal'
				required
				error={Boolean(errors['member.is_internal'])}
			>
				<FormLabel>Jenis</FormLabel>
				<RadioGroup
					name="member.is_internal"
					onChange={handleChange}
					value={member?.is_internal === undefined ? '' : member?.is_internal}
				>
					<FormControlLabel control={<Radio value={true} />} label="Internal" />
					<FormControlLabel control={<Radio value={false} />} label="Eksternal" />
				</RadioGroup>

				{
					Boolean(errors['member.is_internal']) && <FormHelperText>
						{errors['member.is_internal']}
					</FormHelperText>
				}
			</FormControl>

			<TextField
				name="member.code"
				label="Kode Anggota"
				value={member?.code || ''}
				onChange={handleChange}
				fullWidth
				required
				margin="normal"
				error={Boolean(errors['member.code'])}
				helperText={errors['member.code']}
			/>

			<DatePicker
				required
				fullWidth
				onChange={handleJoinedAtMemberChange}
				label="Tanggal Bergabung"
				margin='normal'
				value={member?.joined_at ? moment(member?.joined_at) : null}
				error={Boolean(errors['member.joined_at'])}
				helperText={errors['member.joined_at']}
			/>
		</>
	)
}

function CourierFields({ courier, handleChange, handleJoinedAtCourierChange, errors }) {
	return (
		<>
			<TextField
				name="courier.code"
				label="Kode Pengantar"
				value={courier?.code || ''}
				onChange={handleChange}
				fullWidth
				required
				margin="normal"
				error={Boolean(errors['courier.code'])}
				helperText={errors['courier.code']}
			/>

			<DatePicker
				required
				fullWidth
				onChange={handleJoinedAtCourierChange}
				label="Tanggal Bergabung"
				margin='normal'
				value={courier?.joined_at ? moment(courier?.joined_at) : null}
				error={Boolean(errors['courier.joined_at'])}
				helperText={errors['courier.joined_at']}
			/>
		</>
	)
}