'use client'

// types
import type CashType from '@/types/orms/cash'
import type { KeyedMutator } from 'swr'
// enums
import CashPermission from '@/enums/permissions/Cash'
// vendors
import useSWR from 'swr'
// materials
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
// utils
import numberToCurrency from '@/utils/number-to-currency'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

export let mutate: KeyedMutator<CashType[]>

export default function CashList({
    onNew,
    onEdit,
}: {
    onNew: () => void
    onEdit: (values: CashType) => void
}) {
    const isAuthHasPermission = useIsAuthHasPermission()

    const {
        data: cashes = [],
        isLoading,
        isValidating,
        mutate: mutateCashes,
    } = useSWR<CashType[]>('data/cashes')

    mutate = mutateCashes

    if (isLoading || isValidating) {
        return (
            <Box
                sx={{
                    '& > *': {
                        mb: 2,
                    },
                }}>
                <Skeleton variant="rounded" height={80} />
                <Skeleton variant="rounded" height={80} />
                <Skeleton variant="rounded" height={80} />
            </Box>
        )
    }

    if (isAuthHasPermission(CashPermission.READ) === false) return null

    return (
        <Box
            display="flex"
            gap={2}
            sx={{
                overflowX: 'auto',
                flexDirection: {
                    md: 'column',
                },
            }}>
            {cashes.map(cash => (
                <div key={cash.uuid}>
                    <ThisCard data={cash} onEdit={onEdit} />
                </div>
            ))}

            {!isLoading && isAuthHasPermission(CashPermission.CREATE) && (
                <Button
                    fullWidth
                    sx={{
                        minWidth: 200,
                    }}
                    size="large"
                    variant="outlined"
                    onClick={onNew}
                    startIcon={<AddIcon />}>
                    Tambah Kas
                </Button>
            )}
        </Box>
    )
}

function ThisCard({
    data,
    onEdit,
}: {
    data: CashType
    onEdit: (values: CashType) => void
}) {
    const isAuthHasPermission = useIsAuthHasPermission()

    const isUserCanUpdate = isAuthHasPermission(CashPermission.UPDATE)

    const { code, name, balance } = data

    return (
        <Card>
            <Box p={3} display="flex" alignItems="center" gap={2}>
                <Avatar>{code}</Avatar>

                <div>
                    <Typography
                        color="text.secondary"
                        component="div"
                        display="flex"
                        alignItems="flex-end">
                        {name}
                        {isUserCanUpdate && (
                            <IconButton
                                size="small"
                                onClick={() => onEdit(data)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Typography>

                    <Typography variant="h5" component="div" noWrap>
                        {numberToCurrency(balance)}
                    </Typography>
                </div>
            </Box>
        </Card>
    )
}
