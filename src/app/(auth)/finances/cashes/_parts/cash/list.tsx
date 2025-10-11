'use client'

import AddIcon from '@mui/icons-material/Add'
// icons
import EditIcon from '@mui/icons-material/Edit'
// materials
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import type { KeyedMutator } from 'swr'
// vendors
import useSWR from 'swr'
// enums
import CashPermission from '@/enums/permissions/Cash'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// types
import type CashType from '@/types/orms/cash'
// utils
import numberToCurrency from '@/utils/number-to-currency'

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
                <Skeleton height={80} variant="rounded" />
                <Skeleton height={80} variant="rounded" />
                <Skeleton height={80} variant="rounded" />
            </Box>
        )
    }

    if (isAuthHasPermission(CashPermission.READ) === false) return null

    return (
        <Box
            display="flex"
            gap={2}
            sx={{
                flexDirection: {
                    md: 'column',
                },
                overflowX: 'auto',
            }}>
            {cashes.map(cash => (
                <div key={cash.uuid}>
                    <ThisCard data={cash} onEdit={onEdit} />
                </div>
            ))}

            {!isLoading && isAuthHasPermission(CashPermission.CREATE) && (
                <Button
                    fullWidth
                    onClick={onNew}
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{
                        minWidth: 200,
                    }}
                    variant="outlined">
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
            <Box alignItems="center" display="flex" gap={2} p={3}>
                <Avatar>{code}</Avatar>

                <div>
                    <Typography
                        alignItems="flex-end"
                        color="text.secondary"
                        component="div"
                        display="flex">
                        {name}
                        {isUserCanUpdate && (
                            <IconButton
                                onClick={() => onEdit(data)}
                                size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Typography>

                    <Typography component="div" noWrap variant="h5">
                        {numberToCurrency(balance)}
                    </Typography>
                </div>
            </Box>
        </Card>
    )
}
