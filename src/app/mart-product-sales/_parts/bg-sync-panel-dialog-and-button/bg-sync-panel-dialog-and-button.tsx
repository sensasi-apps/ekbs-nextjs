'use client'

// icons-materials
import Close from '@mui/icons-material/Close'
import Sync from '@mui/icons-material/Sync'
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
import dayjs from 'dayjs'
// vendors
import { useCallback, useEffect, useState } from 'react'
import PrintHandler from '@/components/print-handler'
//
import { type FormattedEntry } from '@/sw/functions/handle-message'
import blinkSxValue from '@/utils/blink-sx-value'
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
import { postToSw } from '@/utils/post-to-sw'
import { type SubmittedData } from '../../../../components/pages/marts/products/sales/formik-wrapper/@types/submitted-data'
import Receipt from '../shared-subcomponents/receipt'

export function BgSyncPanelDialogAndButton() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [entries, setEntries] = useState<FormattedEntry<SubmittedData>[]>()

    const handleGetSales = useCallback(() => {
        setIsLoading(true)

        postToSw('GET_SALES')
            .then(data => {
                setEntries(data)
            })
            .finally(() => setIsLoading(false))
    }, [])

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
    }, [handleGetSales])

    useEffect(() => {
        if (
            open &&
            typeof window !== 'undefined' &&
            typeof window.navigator !== 'undefined'
        ) {
            handleGetSales()
        }
    }, [open, handleGetSales])

    return (
        <>
            <Tooltip arrow placement="top" title="Sinkronisasi Latar Belakang">
                <IconButton
                    color={entries?.length ? 'error' : undefined}
                    onClick={() => setOpen(true)}
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
                <Alert severity="error" sx={blinkSxValue} variant="filled">
                    {entries?.length} Nota belum disinkronkan
                </Alert>
            )}

            <Dialog aria-modal="true" fullWidth maxWidth="md" open={open}>
                {isLoading && <LinearProgress />}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    px={3}
                    py={2}>
                    <Box display="flex" gap={1}>
                        <Typography variant="h6">
                            Sinkronisasi Latar Belakang
                        </Typography>

                        <Tooltip arrow placement="top" title="Sinkronkan ulang">
                            <span>
                                <IconButton
                                    color="success"
                                    disabled={isLoading}
                                    onClick={() => handleSync()}
                                    size="small">
                                    <Sync />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    <Tooltip arrow placement="top" title="Tutup">
                        <IconButton
                            color="error"
                            onClick={() => setOpen(false)}
                            size="small">
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

                                {entries?.map(entry => (
                                    <Row data={entry} key={entry.timestamp} />
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
                    <Typography component="div" variant="caption">
                        {dayjs(lastAttemptAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                )}
            </TableCell>

            <TableCell>
                <PrintHandler>
                    <Receipt
                        data={{
                            at: formData.at,
                            costs: formData.costs.map(cost => ({
                                name: cost.name,
                                rp: cost.rp ?? 0,
                            })),
                            details: formData.details.map(detail => ({
                                cost_rp_per_unit: 0,
                                product: detail.product,
                                product_id: detail.product_id,
                                product_state: null,
                                qty: detail.qty,
                                rp_per_unit: detail.rp_per_unit,
                                warehouse_state: null,
                            })),
                            saleBuyerUser: formData.buyer_user,
                            servedByUserName: formData.buyer_user?.name ?? '-',
                            totalPayment: formData.total_payment,
                            transactionCashName: formData.cashable_name,
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
                        marginBottom: 0,
                        marginTop: 0,
                        paddingLeft: '1em',
                    }}>
                    {details.map(detail => (
                        <li key={detail.product_id}>
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
