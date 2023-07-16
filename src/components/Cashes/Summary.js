import { useContext } from 'react'
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
import AppContext from '@/providers/App'

export default function CashesSummary({ sx, handleEdit, handleNew, ...props }) {
    const {
        auth: { userHasPermission },
    } = useContext(AppContext)

    const { data: cashes = [], isLoading } = useSWR('data/cashes', url =>
        axios.get(url).then(({ data }) => data),
    )

    if (!userHasPermission('cashes read')) return null

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
                                {userHasPermission('cashes update') && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(cash)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Typography>

                            <Typography variant="h4" component="div" noWrap>
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

            {!isLoading && userHasPermission('cashes create') && (
                <Button
                    fullWidth
                    sx={{
                        minWidth: 200,
                    }}
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
