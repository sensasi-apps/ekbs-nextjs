"use client";

import { useState } from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import UserDetailBox from './Detail/Box';

import AddIcon from '@mui/icons-material/Add';
import UserDetailForm from './Detail/Form';
import MemberBox from '../Member/Box';
import MemberForm from '../Member/Form';
import EmployeeBox from '../Employee/Box';
import EmployeeForm from '../Employee/Form';


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3} pb={0}>
					{children}
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	// return {
	// 	id: `simple-tab-${index}`,
	// 	'aria-controls': `simple-tabpanel-${index}`,
	// };
}

export default function UserDetailsTabCard({ data: user, ...props }) {
	if (!user) return null;

	const { uuid, detail, member, employee, courier } = user;

	const [value, setValue] = useState(0);
	const [isFormOpen, setIsFormOpen] = useState(false);

	const handleChange = (event, newValue) => {
		setIsFormOpen(false);
		setValue(newValue);
	};

	return (
		<Card {...props}>
			<CardContent>
				<Box sx={{
					borderBottom: 1,
					borderColor: 'divider'
				}}>
					<Tabs
						variant="scrollable"
						scrollButtons="false"
						value={value}
						onChange={handleChange}
					>
						<Tab label="Alamat & Kontak" {...a11yProps(0)} />
						<Tab label="Detail" {...a11yProps(1)} />
						<Tab label="Karyawan" {...a11yProps(2)} />
						<Tab label="Anggota" {...a11yProps(3)} />
						<Tab label="Pengangkut" {...a11yProps(4)} />
					</Tabs>
				</Box>

				<TabPanel value={value} index={1}>
					<UserDetailBox
						sx={{
							display: isFormOpen || !detail ? 'none' : 'block'
						}}
						uuid={uuid}
						userDetail={detail}
					/>

					<UserDetailForm
						uuid={uuid}
						data={detail}
						isShow={isFormOpen}
						onSubmitted={() => setIsFormOpen(false)}
						onClose={() => setIsFormOpen(false)}
					/>

					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ display: isFormOpen || detail ? 'none' : 'block' }}
					>
						Belum ada data detail pengguna.
					</Typography>

					<Button
						sx={{
							display: isFormOpen ? 'none' : 'flex'
						}}
						color={detail ? 'warning' : 'success'}
						startIcon={detail ? null : <AddIcon />}
						onClick={() => setIsFormOpen(true)}
					>
						{
							detail ? 'Perbaharui detail pengguna' : 'Masukkan detail pengguna'
						}
					</Button>
				</TabPanel>




				<TabPanel value={value} index={2}>
					<EmployeeBox
						sx={{
							display: isFormOpen || !employee ? 'none' : 'block'
						}}
						uuid={uuid}
						data={employee}
					/>

					<EmployeeForm
						uuid={uuid}
						data={employee}
						isShow={isFormOpen}
						onSubmitted={() => setIsFormOpen(false)}
						onClose={() => setIsFormOpen(false)}
					/>

					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ display: isFormOpen || employee ? 'none' : 'block' }}
					>
						Belum ada data karyawan.
					</Typography>

					<Button
						sx={{
							display: isFormOpen ? 'none' : 'flex'
						}}
						color={employee ? 'warning' : 'success'}
						startIcon={employee ? null : <AddIcon />}
						onClick={() => setIsFormOpen(true)}
					>
						{
							employee ? 'Perbaharui data karyawan' : 'Masukkan data karyawan'
						}
					</Button>

				</TabPanel>




				<TabPanel value={value} index={3}>
					<MemberBox
						sx={{
							display: isFormOpen || !member ? 'none' : 'block'
						}}
						uuid={uuid}
						data={member}
					/>

					<MemberForm
						uuid={uuid}
						data={member}
						isShow={isFormOpen}
						onSubmitted={() => setIsFormOpen(false)}
						onClose={() => setIsFormOpen(false)}
					/>

					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ display: isFormOpen || member ? 'none' : 'block' }}
					>
						Belum ada data anggota.
					</Typography>

					<Button
						sx={{
							display: isFormOpen ? 'none' : 'flex'
						}}
						color={member ? 'warning' : 'success'}
						startIcon={member ? null : <AddIcon />}
						onClick={() => setIsFormOpen(true)}
					>
						{
							member ? 'Perbaharui data anggota' : 'Masukkan data anggota'
						}
					</Button>
				</TabPanel>
			</CardContent>
		</Card >
	)
}
