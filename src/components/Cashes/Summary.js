import useSWR from 'swr'
import axios from '@/lib/axios'

import {
    Avatar,
    Box,
    Button,
    Card,
    IconButton,
    Skeleton,
    Typography,
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'

import numberFormat from '@/lib/numberFormat'
import { useContext } from 'react'
import AppContext from '@/providers/App'

export default function CashesSummary({ sx, handleEdit, handleNew, ...props }) {
    const { auth: { user } = {} } = useContext(AppContext)
    const isSuperman = user?.role_names.includes('superman')
    const isUserCanRead =
        isSuperman || user.permission_names?.includes('cashes read')
    if (!isUserCanRead) return false

    const isUserCanCreate =
        isSuperman || user.permission_names?.includes('cashes create')
    const isUserCanUpdate =
        isSuperman || user.permission_names?.includes('cashes update')

    const { data: cashes = [], isLoading } = useSWR('/data/cashes', url =>
        axios.get(url).then(({ data }) => data),
    )

    const ThisCard = ({ data: cash }) => {
        const { code, name, balance } = cash

        return (
            <Box>
                <Card>
                    <Box p={3} display="flex" alignItems="center" gap={2}>
                        <Avatar>{code}</Avatar>

                        <Box>
                            <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom>
                                {name}
                                {isUserCanUpdate && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(cash)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Typography>

                            <Typography variant="h4" component="div">
                                {balance ? numberFormat(balance) : <Skeleton />}
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                gap: 2,
                flexDirection: {
                    md: 'column',
                },
                ...sx,
            }}
            {...props}>
            {cashes.map(cash => (
                <ThisCard data={cash} key={cash.uuid} />
            ))}

            {!isLoading && isUserCanCreate && (
                <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={handleNew}
                    startIcon={<AddIcon />}>
                    Tambah Kas
                </Button>
            )}
        </Box>
    )
}
