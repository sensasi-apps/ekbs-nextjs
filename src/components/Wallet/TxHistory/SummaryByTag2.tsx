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
// enums
import TransactionTag from '@/enums/TransactionTag'
// utils
import formatNumber from '@/utils/formatNumber'
import { Typography } from '@mui/material'

type TxsGroup = { name: string; data: Transaction[] }

const transportTags = [
    TransactionTag.PELUNASAN_BIAYA_ANGKUT,
    TransactionTag.POTONGAN_JASA_KONTRAKTOR_RP_5,
]

const tbsTags = [
    TransactionTag.PELUNASAN_TBS,
    TransactionTag.PPH_22_0_25,
    TransactionTag.POTONGAN_JASA_KOPERASI_1_50,
    TransactionTag.POTONGAN_JASA_OPERASIONAL_KELOMPOK_TANI_0_50,
    TransactionTag.INSENTIF_GRADING,
    TransactionTag.POTONGAN_GRADING,
    TransactionTag.POTONGAN_BIAYA_ANGKUT,
]

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

    const inboundTxs = data.data.filter(tx => tx.amount > 0)
    const outboundTxs = data.data.filter(tx => tx.amount < 0)

    const inboundData: TxsGroup[] = inboundTxs.reduce<TxsGroup[]>((acc, tx) => {
        const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
        const index = acc.findIndex(d => d.name === tag)

        if (index === -1) {
            acc.push({ name: tag, data: [tx] })
        } else {
            acc[index].data.push(tx)
        }

        return acc
    }, [])

    if (inboundData.findIndex(({ name }) => name === 'Lain-lain') >= 0) {
        inboundData.push(
            inboundData.splice(
                inboundData.findIndex(({ name }) => name === 'Lain-lain'),
                1,
            )[0],
        )
    }

    const outboundData = outboundTxs.reduce<TxsGroup[]>((acc, tx) => {
        const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
        const index = acc.findIndex(d => d.name === tag)

        if (index === -1) {
            acc.push({ name: tag, data: [tx] })
        } else {
            acc[index].data.push(tx)
        }

        return acc
    }, [])

    if (outboundData.findIndex(({ name }) => name === 'Lain-lain') >= 0) {
        outboundData.push(
            outboundData.splice(
                outboundData.findIndex(({ name }) => name === 'Lain-lain'),
                1,
            )[0],
        )
    }

    const kgSellTotal = data.data
        .filter(tx =>
            tx.tags.find(tag => tag.name.id === TransactionTag.PELUNASAN_TBS),
        )
        .reduce((acc, tx) => acc + (tx?.transactionable?.n_kg ?? 0), 0)

    const kgDelivTotal = data.data
        .filter(tx =>
            tx.tags.find(
                tag => tag.name.id === TransactionTag.PELUNASAN_BIAYA_ANGKUT,
            ),
        )
        .reduce((acc, tx) => acc + (tx?.transactionable?.n_kg ?? 0), 0)

    const tbsData = data.data
        .filter(tx => tx.tags.find(tag => tbsTags.includes(tag.name.id as any)))
        .reduce<TxsGroup[]>((acc, tx) => {
            const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
            const index = acc.findIndex(d => d.name === tag)

            if (index === -1) {
                acc.push({ name: tag, data: [tx] })
            } else {
                acc[index].data.push(tx)
            }

            return acc
        }, [])

    const tbsTotalRp = tbsData.reduce(
        (acc, { data }) => acc + data.reduce((acc, tx) => acc + tx.amount, 0),
        0,
    )

    const transportData = data.data
        .filter(tx =>
            tx.tags.find(tag => transportTags.includes(tag.name.id as any)),
        )
        .reduce<TxsGroup[]>((acc, tx) => {
            const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
            const index = acc.findIndex(d => d.name === tag)

            if (index === -1) {
                acc.push({ name: tag, data: [tx] })
            } else {
                acc[index].data.push(tx)
            }

            return acc
        }, [])

    const transportTotalRp = transportData.reduce(
        (acc, { data }) => acc + data.reduce((acc, tx) => acc + tx.amount, 0),
        0,
    )

    const etcData = data.data
        .filter(
            tx => !tx.tags.find(tag => tbsTags.includes(tag.name.id as any)),
        )
        .filter(
            tx =>
                !tx.tags.find(tag =>
                    transportTags.includes(tag.name.id as any),
                ),
        )
        .reduce<TxsGroup[]>((acc, tx) => {
            const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
            const index = acc.findIndex(d => d.name === tag)

            if (index === -1) {
                acc.push({ name: tag, data: [tx] })
            } else {
                acc[index].data.push(tx)
            }

            return acc
        }, [])

    const etcTotalRp = etcData.reduce(
        (acc, { data }) => acc + data.reduce((acc, tx) => acc + tx.amount, 0),
        0,
    )

    return (
        <TableContainer>
            <Table size="small">
                <TableBody>
                    {tbsTotalRp != 0 && (
                        <>
                            <HeadingRow>
                                TBS — {formatNumber(kgSellTotal)} kg
                            </HeadingRow>

                            {tbsData
                                .filter(d => d.data.length > 0)
                                .map((data, i) => (
                                    <ItemRow key={i} {...data} />
                                ))}

                            <TotalRow total={tbsTotalRp} />
                        </>
                    )}

                    {transportTotalRp != 0 && (
                        <>
                            <HeadingRow>
                                Transport — {formatNumber(kgDelivTotal)} kg
                            </HeadingRow>

                            {transportData
                                .filter(d => d.data.length > 0)
                                .map((data, i) => (
                                    <ItemRow key={i} {...data} />
                                ))}

                            <TotalRow total={transportTotalRp} />
                        </>
                    )}

                    {etcTotalRp != 0 && (
                        <>
                            <HeadingRow>Potongan dan Lain-lain</HeadingRow>

                            {etcData
                                .filter(d => d.data.length > 0)
                                .map((data, i) => (
                                    <ItemRow key={i} {...data} />
                                ))}

                            <TotalRow total={etcTotalRp} />
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

    return (
        <TableRow
            sx={{
                '*': {
                    color: rpTotal > 0 ? 'success.main' : 'inherit',
                },
                '& td': {
                    py: 0.35,
                },
            }}>
            <TableCell>{name}</TableCell>
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
