// types
import type CashType from '@/dataTypes/Cash'
import type { KeyedMutator } from 'swr'
// vendors
import useSWR from 'swr'
import { useFormikContext } from 'formik'
// materials
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// icons
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
// components
import CardListSkeletons from '../Ui/CardListSkeletons'
// providers
import useAuth from '@/providers/Auth'
// utils
import numberToCurrency from '@/utils/numberToCurrency'

export let mutate: KeyedMutator<CashType[]>

export default function CashList() {
    const { userHasPermission } = useAuth()
    const { setStatus } = useFormikContext()

    const {
        data: cashes = [],
        isLoading,
        isValidating,
        mutate: mutateCashes,
    } = useSWR<CashType[]>('data/cashes')

    mutate = mutateCashes

    if (isLoading || isValidating) {
        return <CardListSkeletons />
    }

    if (userHasPermission('cashes read') === false) return null

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
                    <ThisCard data={cash} />
                </div>
            ))}

            {!isLoading && userHasPermission('cashes create') && (
                <Button
                    fullWidth
                    sx={{
                        minWidth: 200,
                    }}
                    size="large"
                    variant="outlined"
                    onClick={() => setStatus({ dialogOpen: true })}
                    startIcon={<AddIcon />}>
                    Tambah Kas
                </Button>
            )}
        </Box>
    )
}

const ThisCard = ({ data: cash }: { data: CashType }) => {
    const { userHasPermission } = useAuth()
    const { setValues, setStatus } = useFormikContext()

    const isUserCanUpdate = userHasPermission('cashes update')

    const { code, name, balance } = cash

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
                                onClick={() => {
                                    setValues(cash)
                                    setStatus({ dialogOpen: true })
                                }}>
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
