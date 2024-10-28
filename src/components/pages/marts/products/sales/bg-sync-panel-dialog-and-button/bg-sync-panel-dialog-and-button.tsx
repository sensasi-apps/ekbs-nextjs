import { postMessageToSW } from '@/functions/post-message-to-sw'
import { Close, Refresh } from '@mui/icons-material'
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { BgSyncQueue } from '@/@types/bg-sync-queue'
import PrintHandler from '@/components/PrintHandler'
import Receipt from '../@shared-subcomponents/receipt'
import { FormValuesType } from '../formik-wrapper'
import dayjs from 'dayjs'
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'

export function BgSyncPanelDialogAndButton() {
    const [open, setOpen] = useState(false)
    const [bgSyncQueues, setBgSyncQueues] =
        useState<BgSyncQueue<Required<FormValuesType>>[]>()

    useEffect(() => {
        postMessageToSW<BgSyncQueue<Required<FormValuesType>>[]>({
            action: 'GET_SALES',
        }).then(data => setBgSyncQueues(data))
    }, [])

    return (
        <>
            <Tooltip title="Sinkronisasi Latar Belakang">
                <IconButton onClick={() => setOpen(true)}>
                    <Refresh />
                </IconButton>
            </Tooltip>

            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogTitle
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Box display="flex" gap={1}>
                        Sinkronisasi Latar Belakang
                        <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                                postMessageToSW<
                                    BgSyncQueue<Required<FormValuesType>>[]
                                >({
                                    action: 'FORCE_SYNC',
                                }).then(() => {
                                    postMessageToSW<
                                        BgSyncQueue<Required<FormValuesType>>[]
                                    >({
                                        action: 'GET_SALES',
                                    }).then(data => setBgSyncQueues(data))
                                })
                            }}>
                            <Refresh />
                        </IconButton>
                    </Box>

                    <IconButton
                        size="small"
                        onClick={() => setOpen(false)}
                        color="error">
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>NO</TableCell>
                                <TableCell>Barang</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Waktu kirim data</TableCell>
                                <TableCell>Cetak</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {bgSyncQueues?.map((queue, i) => (
                                <TableRow key={i}>
                                    <TableCell>{queue.body.no}</TableCell>

                                    <TableCell>
                                        <Values data={queue.body} />
                                    </TableCell>

                                    <TableCell>
                                        {numberToCurrency(
                                            queue.body.details.reduce(
                                                (acc, detail) =>
                                                    acc +
                                                    detail.rp_per_unit *
                                                        detail.qty,
                                                0,
                                            ) +
                                                queue.body.costs.reduce(
                                                    (acc, cost) =>
                                                        acc + (cost?.rp ?? 0),
                                                    0,
                                                ),
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {dayjs(queue.timestamp).format(
                                            'DD-MM-YYYY HH:mm:ss',
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <PrintHandler>
                                            <Receipt
                                                data={{
                                                    at: queue.body.at,
                                                    saleNo: queue.body.no,
                                                    servedByUserName:
                                                        queue.body.buyer_user
                                                            ?.name ?? '-',
                                                    saleBuyerUser:
                                                        queue.body.buyer_user,
                                                    transactionCashName:
                                                        queue.body
                                                            .cashable_name,
                                                    details:
                                                        queue.body.details.map(
                                                            detail => ({
                                                                product:
                                                                    detail.product,
                                                                product_id:
                                                                    detail.product_id,
                                                                qty: detail.qty,
                                                                rp_per_unit:
                                                                    detail.rp_per_unit,
                                                                cost_rp_per_unit: 0,
                                                                product_state:
                                                                    null,
                                                                warehouse_state:
                                                                    null,
                                                            }),
                                                        ),
                                                    costs: queue.body.costs.map(
                                                        cost => ({
                                                            name: cost.name,
                                                            rp: cost.rp ?? 0,
                                                        }),
                                                    ),
                                                    totalPayment:
                                                        queue.body
                                                            .total_payment,
                                                }}
                                            />
                                        </PrintHandler>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    )
}

function Values({
    data: { buyer_user, details },
}: {
    data: Required<FormValuesType>
}) {
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
