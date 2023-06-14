import useSWR from 'swr';
import axios from '@/lib/axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import GroupsIcon from '@mui/icons-material/Groups';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import BadgeIcon from '@mui/icons-material/Badge';
import FireTruckIcon from '@mui/icons-material/FireTruck';


const CARDS_METADATA = [
	{
		title: 'Total',
		dataName: 'n_user',
		icon: <GroupsIcon sx={{ fontSize: 64, mr: 3 }} />,
	},
	{
		title: 'Anggota',
		dataName: 'n_member',
		icon: <Diversity3Icon sx={{ fontSize: 64, mr: 3 }} />,
	}, {
		title: 'Karyawan',
		dataName: 'n_employee',
		icon: <BadgeIcon sx={{ fontSize: 64, mr: 3 }} />,
	}, {
		title: 'Pengangkut',
		dataName: 'n_courier',
		icon: <FireTruckIcon sx={{ fontSize: 64, mr: 3 }} />,
	}
];

const TheCard = ({ title, icon, value }) => <Box>
	<Card>
		<Box p={3} display='flex' alignItems='center'>
			{icon}

			<Box>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					{title}
				</Typography>

				<Typography variant="h4" component="div">
					{value === undefined ? <Skeleton /> : value}
				</Typography>
			</Box>
		</Box>
	</Card>
</Box>

export default function Summary({ sx, ...props }) {
	const { data = {} } = useSWR('/users/summary', url => axios.get(url).then(({ data }) => data));

	return (
		<Box
			sx={{
				display: 'flex',
				overflowX: 'auto',
				gap: 2,
				flexDirection: {
					md: 'column'
				},
				...sx
			}}
			{...props}
		>
			{
				CARDS_METADATA.map((meta, index) => <TheCard
					key={index}
					{...meta}
					value={data[meta.dataName]}
				/>)
			}
		</Box>
	)
}