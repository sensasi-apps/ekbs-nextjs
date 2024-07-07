// types
import type { ApiResponseType } from '../TxHistory'
import type Transaction from '@/dataTypes/Transaction'
import type { ReactNode } from 'react'
// materials
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// enums
import TransactionTag from '@/enums/TransactionTag'
// utils
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

type TxsGroup = { name: string; data: Transaction[] }

const TRANSPORT_STRING_TAGS = [
    TransactionTag.PELUNASAN_BIAYA_ANGKUT,
    TransactionTag.POTONGAN_JASA_KONTRAKTOR_RP_5,
].map(tag => tag.toString())

const TBS_STRING_TAGS = [
    TransactionTag.PELUNASAN_TBS,
    TransactionTag.PPH_22_0_25,
    TransactionTag.POTONGAN_JASA_KOPERASI_1_50,
    TransactionTag.POTONGAN_JASA_OPERASIONAL_KELOMPOK_TANI_0_50,
    TransactionTag.INSENTIF_GRADING,
    TransactionTag.POTONGAN_GRADING,
    TransactionTag.POTONGAN_BIAYA_ANGKUT,
].map(tag => tag.toString())

export default function SummaryByTag2({ data }: { data: ApiResponseType }) {
    if (data.data.length === 0) {
        return (
            <Typography
                color="text.disabled"
                variant="caption"
                fontStyle="italic"
                maxWidth="20em"
                component="div">
                Tidak terdapat aktivitas transaksi pada rentang tanggal yang
                dipilih
            </Typography>
        )
    }

    const {
        txses: tbsData,
        rpTotal: tbsRpTotal,
        kgTotal: tbsKgTotal,
    } = getTotalAndData(data, 'tbs')

    const {
        txses: transportData,
        rpTotal: transportRpTotal,
        kgTotal: transportKgTotal,
    } = getTotalAndData(data, 'delivery')

    const { txses: etcData, rpTotal: etcRpTotal } = getTotalAndData(data, 'etc')

    return (
        <TableContainer>
            <Table size="small">
                <TableBody>
                    {tbsRpTotal != 0 && (
                        <>
                            <HeadingRow>
                                TBS — {formatNumber(tbsKgTotal)} kg
                            </HeadingRow>

                            {tbsData
                                .filter(d => d.data.length > 0)
                                .map((data, i) => (
                                    <ItemRow key={i} {...data} />
                                ))}

                            <TotalRow total={tbsRpTotal} />
                        </>
                    )}

                    {transportRpTotal != 0 && (
                        <>
                            <HeadingRow>
                                Transport — {formatNumber(transportKgTotal)} kg
                            </HeadingRow>

                            {transportData
                                .filter(d => d.data.length > 0)
                                .map((data, i) => (
                                    <ItemRow key={i} {...data} />
                                ))}

                            <TotalRow total={transportRpTotal} />
                        </>
                    )}

                    {etcRpTotal != 0 && (
                        <>
                            <HeadingRow>Potongan dan Lain-lain</HeadingRow>

                            {etcData
                                .filter(d => d.data.length > 0)
                                .map((data, i) => (
                                    <ItemRow key={i} {...data} />
                                ))}

                            <TotalRow total={etcRpTotal} />
                        </>
                    )}

                    <TotalRow
                        bg
                        desc="Total Akhir"
                        total={data.data.reduce(
                            (acc, tx) => acc + tx.amount,
                            0,
                        )}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function ItemRow({ name, data }: TxsGroup) {
    const rpTotal = data.reduce((acc, tx) => acc + tx.amount, 0)

    const details = data
        .filter(tx =>
            [
                TransactionTag.PELUNASAN_BIAYA_ANGKUT.toString(),
                TransactionTag.PELUNASAN_TBS.toString(),
                TransactionTag.POTONGAN_BIAYA_ANGKUT.toString(),
            ].includes(tx.tags[0].name.id),
        )
        .map(tx => {
            if (!tx.transactionable) return

            if (
                'delivery' in tx.transactionable &&
                tx.transactionable.delivery?.deliverable &&
                tx.tags[0].name.id === TransactionTag.PELUNASAN_TBS
            ) {
                return {
                    kg: tx.transactionable?.n_kg,
                    rp_per_kg:
                        tx.transactionable?.delivery?.deliverable.rate
                            ?.rp_per_kg,
                }
            }

            if (
                'delivery' in tx.transactionable &&
                tx.transactionable.delivery?.deliverable &&
                tx.tags[0].name.id === TransactionTag.POTONGAN_BIAYA_ANGKUT
            ) {
                return {
                    kg: tx.transactionable?.n_kg,
                    rp_per_kg: tx.transactionable?.delivery?.rate?.rp_per_kg,
                }
            }

            if (
                'rate' in tx.transactionable &&
                tx.tags[0].name.id === TransactionTag.PELUNASAN_BIAYA_ANGKUT
            ) {
                return {
                    kg: tx.transactionable?.n_kg,
                    rp_per_kg: tx.transactionable?.rate?.rp_per_kg,
                }
            }
        })
        .reduce<
            {
                kg: number
                rp_per_kg: number
            }[]
        >((acc, data) => {
            const index = acc?.findIndex(d => d.rp_per_kg === data?.rp_per_kg)

            if (index === -1) {
                acc.push({
                    kg: data?.kg ?? 0,
                    rp_per_kg: data?.rp_per_kg ?? 0,
                })
            } else {
                acc[index].kg += data?.kg ?? 0
            }

            return acc
        }, [])

    return (
        <>
            <TableRow
                sx={{
                    '& td': {
                        color: rpTotal > 0 ? 'success.main' : 'inherit',
                        py: 0.35,
                    },
                }}>
                <TableCell>
                    {name}

                    {details && (
                        <ul
                            style={{
                                margin: 0,
                            }}>
                            {details.map((d, i) => (
                                <li key={i}>
                                    {formatNumber(d.kg)} kg &times;{' '}
                                    {numberToCurrency(d.rp_per_kg)}
                                </li>
                            ))}
                        </ul>
                    )}
                </TableCell>
                <TableCell>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            justifyContent: 'space-between',
                        }}>
                        <Box>Rp</Box>
                        <Box>{formatNumber(rpTotal)}</Box>
                    </Box>
                </TableCell>
            </TableRow>
        </>
    )
}

function HeadingRow({ children }: { children: ReactNode }) {
    return (
        <TableRow
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}>
            <TableCell
                colSpan={2}
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    pb: 0.4,
                }}>
                {children}
            </TableCell>
        </TableRow>
    )
}

function TotalRow({
    bg = false,
    desc = 'Total',
    total,
}: {
    bg?: boolean
    desc?: string
    total: number
}) {
    return (
        <TableRow
            sx={{
                '*': {
                    fontWeight: 'bold !important',
                },
                backgroundColor: bg ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
            }}>
            <TableCell
                sx={{
                    textTransform: 'uppercase',
                    py: 1,
                }}
                align="right">
                {desc}
            </TableCell>
            <TableCell>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        justifyContent: 'space-between',
                    }}>
                    <span>Rp</span>

                    <span>{formatNumber(total)}</span>
                </Box>
            </TableCell>
        </TableRow>
    )
}

function getTotalAndData(
    data: ApiResponseType,
    section: 'tbs' | 'delivery' | 'etc',
) {
    let txs: Transaction[] = []
    let kgTotal = 0

    switch (section) {
        case 'tbs':
            txs = data.data.filter(tx =>
                tx.tags.find(tag => TBS_STRING_TAGS.includes(tag.name.id)),
            )

            kgTotal = data.data
                .filter(tx =>
                    tx.tags.find(
                        tag => tag.name.id === TransactionTag.PELUNASAN_TBS,
                    ),
                )
                .reduce((acc, tx) => acc + (tx?.transactionable?.n_kg ?? 0), 0)
            break

        case 'delivery':
            txs = data.data.filter(tx =>
                tx.tags.find(tag =>
                    TRANSPORT_STRING_TAGS.includes(tag.name.id),
                ),
            )

            kgTotal = data.data
                .filter(tx =>
                    tx.tags.find(
                        tag =>
                            tag.name.id ===
                            TransactionTag.PELUNASAN_BIAYA_ANGKUT,
                    ),
                )
                .reduce((acc, tx) => acc + (tx?.transactionable?.n_kg ?? 0), 0)
            break

        default:
            txs = data.data.filter(
                tx =>
                    !tx.tags.find(
                        tag =>
                            TBS_STRING_TAGS.includes(tag.name.id) ||
                            TRANSPORT_STRING_TAGS.includes(tag.name.id),
                    ),
            )
            break
    }

    const txses = txs.reduce<TxsGroup[]>((acc, tx) => {
        const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
        const index = acc.findIndex(d => d.name === tag)

        if (index === -1) {
            acc.push({ name: tag, data: [tx] })
        } else {
            acc[index].data.push(tx)
        }

        return acc
    }, [])

    const rpTotal = txses.reduce(
        (acc, { data }) => acc + data.reduce((acc, tx) => acc + tx.amount, 0),
        0,
    )

    return {
        txses,
        rpTotal,
        kgTotal,
    }
}
