// vendors
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
// materials
import Alert from '@mui/material/Alert'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons-materials
import Close from '@mui/icons-material/Close'
import Sync from '@mui/icons-material/Sync'
//
import { type FormattedEntry } from '@/sw/functions/handle-message'
import { postToSw } from '@/functions/post-to-sw'
import { type SubmittedData } from '../formik-wrapper/@types/submitted-data'
import PrintHandler from '@/components/PrintHandler'
import Receipt from '../@shared-subcomponents/receipt'
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'
import blinkSxValue from '@/utils/blinkSxValue'

export function BgSyncPanelDialogAndButton() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [entries, setEntries] = useState<FormattedEntry<SubmittedData>[]>()

    function handleGetSales() {
        setIsLoading(true)

        postToSw('GET_SALES')
            .then(data => {
                setEntries(data)
            })
            .finally(() => setIsLoading(false))
    }

    function handleSync() {
        setIsLoading(true)

        postToSw('FORCE_SYNC').finally(() =>
            setTimeout(() => handleGetSales(), 1000),
        )
    }

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            typeof window.navigator !== 'undefined'
        ) {
            addEventListener('mart-sale-queued', handleGetSales)

            handleGetSales()
        }

        return () => removeEventListener('mart-sale-queued', handleGetSales)
    }, [])

    useEffect(() => {
        if (
            open &&
            typeof window !== 'undefined' &&
            typeof window.navigator !== 'undefined'
        ) {
            handleGetSales()
        }
    }, [open])

    return (
        <>
            <Tooltip title="Sinkronisasi Latar Belakang" arrow placement="top">
                <IconButton
                    onClick={() => setOpen(true)}
                    color={entries?.length ? 'error' : undefined}
                    sx={entries?.length ? blinkSxValue : undefined}>
                    <Badge badgeContent={entries?.length} color="error">
                        <Sync
                            sx={{
                                fontSize: entries?.length ? 48 : undefined,
                            }}
                        />
                    </Badge>
                </IconButton>
            </Tooltip>

            {(entries?.length ?? 0) > 0 && (
                <Alert variant="filled" severity="error" sx={blinkSxValue}>
                    {entries?.length} Nota belum disinkronkan
                </Alert>
            )}

            <Dialog open={open} maxWidth="md" fullWidth aria-modal="true">
                {isLoading && <LinearProgress />}

                <Box
                    display="flex"
                    py={2}
                    px={3}
                    justifyContent="space-between">
                    <Box display="flex" gap={1}>
                        <Typography variant="h6">
                            Sinkronisasi Latar Belakang
                        </Typography>

                        <Tooltip title="Sinkronkan ulang" arrow placement="top">
                            <span>
                                <IconButton
                                    size="small"
                                    color="success"
                                    disabled={isLoading}
                                    onClick={() => handleSync()}>
                                    <Sync />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    <Tooltip title="Tutup" arrow placement="top">
                        <IconButton
                            size="small"
                            onClick={() => setOpen(false)}
                            color="error">
                            <Close />
                        </IconButton>
                    </Tooltip>
                </Box>

                <DialogContent>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pada</TableCell>
                                    <TableCell>Barang</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Cetak</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!entries?.length && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography
                                                align="center"
                                                variant="body2">
                                                Tidak ada data
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {entries?.map((entry, i) => (
                                    <Row key={i} data={entry} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </>
    )
}

function Row({
    data: { body: formData, status, lastAttemptAt },
}: {
    data: FormattedEntry<SubmittedData>
}) {
    return (
        <TableRow>
            <TableCell>
                {dayjs(formData.at).format('DD-MM-YYYY HH:mm:ss')}
            </TableCell>

            <TableCell>
                <Values data={formData} />
            </TableCell>

            <TableCell>
                {numberToCurrency(
                    formData.details.reduce(
                        (acc, detail) => acc + detail.rp_per_unit * detail.qty,
                        0,
                    ) +
                        formData.costs.reduce(
                            (acc, cost) => acc + (cost?.rp ?? 0),
                            0,
                        ),
                )}
            </TableCell>

            <TableCell>
                {status}

                {lastAttemptAt && (
                    <Typography variant="caption" component="div">
                        {dayjs(lastAttemptAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                )}
            </TableCell>

            <TableCell>
                <PrintHandler>
                    <Receipt
                        data={{
                            at: formData.at,
                            servedByUserName: formData.buyer_user?.name ?? '-',
                            saleBuyerUser: formData.buyer_user,
                            transactionCashName: formData.cashable_name,
                            details: formData.details.map(detail => ({
                                product: detail.product,
                                product_id: detail.product_id,
                                qty: detail.qty,
                                rp_per_unit: detail.rp_per_unit,
                                cost_rp_per_unit: 0,
                                product_state: null,
                                warehouse_state: null,
                            })),
                            costs: formData.costs.map(cost => ({
                                name: cost.name,
                                rp: cost.rp ?? 0,
                            })),
                            totalPayment: formData.total_payment,
                        }}
                    />
                </PrintHandler>
            </TableCell>
        </TableRow>
    )
}

function Values({ data: { buyer_user, details } }: { data: SubmittedData }) {
    return (
        <>
            <Typography>{buyer_user?.name}</Typography>

            <Typography component="div">
                <ul
                    style={{
                        marginTop: 0,
                        marginBottom: 0,
                        paddingLeft: '1em',
                    }}>
                    {details.map((detail, i) => (
                        <li key={i}>
                            <Typography
                                sx={{
                                    lineHeight: '0.7em',
                                    whiteSpace: 'nowrap',
                                }}>
                                {detail.product?.name}
                            </Typography>

                            <Typography variant="overline">
                                {numberToCurrency(detail.rp_per_unit)} x{' '}
                                {formatNumber(detail.qty)}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </Typography>
        </>
    )
}
