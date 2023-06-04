import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

export default function UserDetail({ user }) {
	return (
		<Card>
			<CardContent>
				<Box display='flex' alignItems='center' mb={1}>
					<Typography variant="h5" component="div">
						{user.name}
					</Typography>

					{
						user.gender_id && (user.gender_id === 1 ?
							<MaleIcon color='info' sx={{ ml: 1 }} /> :
							<FemaleIcon color='error' sx={{ ml: 1 }} />)
					}
				</Box>

				<Box display='flex' alignItems='center'>
					<Typography mr={1}>
						{user.email}
					</Typography>

					<Typography variant='caption'>
						{user.citizenship_id}
					</Typography>
				</Box>

				<Button
					variant="outlined"
					color={user.is_active ? 'error' : 'success'}
					size="small"
					sx={{ mt: 2, mr: 2 }}
				>
					{user.is_active ? 'Nonaktifkan' : 'Aktifkan'} akun
				</Button>

				<Button variant="outlined" color='warning' size="small" sx={{ mt: 2 }}>
					Atur kata sandi
				</Button>

				{
					user.employee && <>
						<Divider sx={{ my: 2 }} />
						<Typography variant="overline" component="div" gutterBottom>
							Data Pegawai
						</Typography>

						<Box display='flex' alignItems='center'>
							<Typography mr={1}>
								{user.employee.code}
							</Typography>

							<Typography variant='caption'>
								{user.employee.joined_at ? moment(user.employee.joined_at).format('DD MMMM YYYY') : ''}
							</Typography>
						</Box>
					</>
				}

				{
					user.member && <>
						<Divider sx={{ my: 2 }} />

						<Typography mr={1} variant="overline" component="div" gutterBottom>
							Data Anggota
						</Typography>

						<Box display='flex' alignItems='center'>
							<Typography mr={1}>
								{user.member.code}
							</Typography>

							<Typography mr={1} variant='caption'>
								{user.member.joined_at ? moment(user.member.joined_at).format('DD MMMM YYYY') : ''}
							</Typography>

							<Chip size='small' label={user.member.is_internal ? 'Internal' : 'Eksternal'} />
						</Box>
					</>
				}

				{
					user.courier && <>
						<Divider sx={{ my: 2 }} />

						<Typography variant="overline" component="div" gutterBottom>
							Data Pengantar
						</Typography>

						<Box display='flex' alignItems='center'>
							<Typography mr={1}>
								{user.courier.code}
							</Typography>

							<Typography mr={1} variant='caption'>
								{user.courier.joined_at ? moment(user.courier.joined_at).format('DD MMMM YYYY') : ''}
							</Typography>
						</Box>
					</>
				}


				{/* TODO: set password */}

			</CardContent>
			{/* <CardActions>
				<Button size="small">Learn More</Button>
			</CardActions> */}
		</Card>
	)
}