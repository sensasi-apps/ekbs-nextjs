"use client";

import { useState, useEffect } from 'react';
import { mutate } from 'swr';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';


import moment from 'moment';
import 'moment/locale/id';
import ImageForm from '@/components/ImageForm';

export default function UserDetailBox({ uuid, userDetail, ...props }) {
	if (!userDetail) return null;

	const {
		birth_at,
		birth_regency,
		birth_regency_id,
		birth_district,
		birth_district_id,
		bpjs_kesehatan_no,
		citizen_id,
		files,
		gender,
		job_desc,
		job_title,
		last_education,
		marital_status,
		n_children
	} = userDetail;

	const pasFoto = files.find(file => file.alias === 'Pas Foto');
	const fotoKtp = files.find(file => file.alias === 'Foto KTP');

	const [isFormOpen, setIsFormOpen] = useState(false);


	return (
		<Box {...props}>
			{
				!isFormOpen && <Box>
					<Row title='Foto Diri'>
						<ImageForm
							defaultValue={pasFoto?.uuid ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${pasFoto.uuid}` : null}
							action={`/users/${uuid}/detail/pas-foto-upload`}
							onSubmitted={() => mutate(`/users/${uuid}`)}
							name="pas_foto"
						/>
					</Row>

					<Row title='NIK'>
						{citizen_id || '='}
					</Row>

					<Row title='Foto KTP'>
						<ImageForm
							defaultValue={fotoKtp?.uuid ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${fotoKtp.uuid}` : null}
							action={`/users/${uuid}/detail/ktp-upload`}
							onSubmitted={() => mutate(`/users/${uuid}`)}
							name="foto_ktp"
						/>
					</Row>

					<Row title='Jenis Kelamin'>
						{gender?.name || '-'}
					</Row>

					<Row title='Tempat dan Tanggal Lahir'>
						<Typography>
							{
								birth_regency_id ? (`${birth_regency.name}, `) : '-'
							}

							{
								birth_district_id ? (`${birth_district.name}, `) : '-'
							}

							{
								birth_at ? moment(birth_at).format('DD MMMM YYYY') : '-'
							}
						</Typography>
					</Row>

					<Row title='Nomor BPJS Kesehatan'>
						{bpjs_kesehatan_no || '-'}
					</Row>

					<Row title='Pekerjaan' helperText={job_desc}>
						{job_title || '-'}
					</Row>

					<Row title='Pendidikan Terakhir'>
						{last_education?.name || '-'}
					</Row>

					<Row title='Status Pernikahan'>
						{marital_status?.name || '-'}
					</Row>

					<Row title='Jumlah Anak'>
						{n_children === null ? '-' : `${n_children} orang`}
					</Row>
				</Box>
			}


			{/* {
					isFormOpen && <UserForm
						user={user}
						onChange={(newUser) => setUser(newUser)}
						onClose={() => setIsFormOpen(false)}
					/>
				} */}
		</Box>
	)
}

function Row({ title, children, helperText, ...props }) {
	return (
		<Box {...props} mb={1}>
			<Typography variant='caption' color='text.secondary'>
				{title}
			</Typography>
			{
				typeof children === 'string' &&
				<Typography>
					{children}
				</Typography>
			}

			{
				typeof children !== 'string' && children
			}

			{
				helperText && <Typography variant='body2'>
					{helperText}
				</Typography>
			}
		</Box>
	)

}