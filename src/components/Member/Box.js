import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import moment from "moment";

export default function MemberBox({ data: member, ...props }) {
	if (!member) return null;

	const { joined_at, unjoined_at, unjoined_reason, note } = member

	const getStatus = () => {
		if (unjoined_at) return 'Berhenti / Keluar';

		return 'Aktif';
	}

	return (
		<Box {...props}>
			<Row title='Status'>
				<Typography variant="h5" color={unjoined_at ? 'error.light' : 'success.light'} component='div'>
					{getStatus()}
				</Typography>
			</Row>

			<Row title='Tanggal Bergabung'>
				{joined_at ? moment(joined_at).format('DD MMMM YYYY') : '-'}
			</Row>

			{
				unjoined_at && <>
					<Row title='Tanggal Berhenti/Keluar'>
						{unjoined_at ? moment(unjoined_at).format('DD MMMM YYYY') : '-'}
					</Row>

					<Row title='Alasan Berhenti/Keluar'>
						{unjoined_reason || '-'}
					</Row>
				</>
			}

			<Row title='Catatan tambahan'>
				{note || '-'}
			</Row>
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