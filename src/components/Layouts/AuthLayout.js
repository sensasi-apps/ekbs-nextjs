
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import Head from 'next/head'
import LoadingCenter from '../Statuses/LoadingCenter'
import ErrorCenter from '../Statuses/ErrorCenter'

const AuthLayout = ({
	children,
	title,
	icon,
	isLoading = false,
	isError = false,
	message,
}) => {
	return (
		<div>
			<Head>
				<title>{`${title} — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
			</Head>

			<Container component="main" maxWidth="xs">
				<Box
					mt={6}
					display="flex"
					flexDirection="column"
					alignItems="center"
				>

					<Avatar sx={{
						m: 1, bgcolor: () => {
							if (isLoading) return 'primary.main'
							if (isError) return 'error.main'
						}
					}}>
						{icon}
					</Avatar>

					<Typography component="h1" variant="body2">
						{process.env.NEXT_PUBLIC_APP_NAME}
					</Typography>

					<Typography component="h1" variant="h5">
						{title}
					</Typography>

					<LoadingCenter isShow={isLoading} message={message} />

					<ErrorCenter isShow={isError} message={message} />

					<Box
						display={isLoading ? 'none' : 'block'}
						mt={2}
					>
						{children}
					</Box>

					<Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 6 }}>
						{'Copyright © '}
						<Link color="inherit" href="https://github.com/sensasi-apps" target='_blank'>
							Sensasi Apps
						</Link>{' '}
						{new Date().getFullYear()}
						{'.'}
					</Typography>
				</Box>
			</Container>
		</div >
	)
}

export default AuthLayout
