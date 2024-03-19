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
// components
import InfoBox from '@/components/InfoBox'
// enums
import TransactionTag from '@/enums/TransactionTag'
// utils
import formatNumber from '@/utils/formatNumber'

export default function SummaryByTag({ data }: { data: ApiResponseType }) {
    const inboundTxs = data.data.filter(tx => tx.amount > 0)
    const outboundTxs = data.data.filter(tx => tx.amount < 0)

    const inboundData: { name: string; data: Transaction[] }[] =
        inboundTxs.reduce<{ name: string; data: Transaction[] }[]>(
            (acc, tx) => {
                const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
                const index = acc.findIndex(d => d.name === tag)

                if (index === -1) {
                    acc.push({ name: tag, data: [tx] })
                } else {
                    acc[index].data.push(tx)
                }

                return acc
            },
            [],
        )

    if (inboundData.findIndex(({ name }) => name === 'Lain-lain') >= 0) {
        inboundData.push(
            inboundData.splice(
                inboundData.findIndex(({ name }) => name === 'Lain-lain'),
                1,
            )[0],
        )
    }

    const outboundData: { name: string; data: Transaction[] }[] =
        outboundTxs.reduce<{ name: string; data: Transaction[] }[]>(
            (acc, tx) => {
                const tag = tx.tags[0]?.name.id ?? 'Lain-lain'
                const index = acc.findIndex(d => d.name === tag)

                if (index === -1) {
                    acc.push({ name: tag, data: [tx] })
                } else {
                    acc[index].data.push(tx)
                }

                return acc
            },
            [],
        )

    if (outboundData.findIndex(({ name }) => name === 'Lain-lain') >= 0) {
        outboundData.push(
            outboundData.splice(
                outboundData.findIndex(({ name }) => name === 'Lain-lain'),
                1,
            )[0],
        )
    }

    const inboundTotalRp = inboundData.reduce(
        (acc, { data }) => acc + data.reduce((acc, tx) => acc + tx.amount, 0),
        0,
    )

    const outboundTotalRp = outboundData.reduce(
        (acc, { data }) => acc + data.reduce((acc, tx) => acc + tx.amount, 0),
        0,
    )

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

    return (
        <>
            <InfoBox
                data={[
                    {
                        label: 'Total Bobot Jual TBS',
                        value: formatNumber(kgSellTotal) + ' kg',
                    },
                    {
                        label: 'Total Bobot Angkut TBS',
                        value: formatNumber(kgDelivTotal) + ' kg',
                    },
                ]}
            />
            <TableContainer>
                <Table size="small">
                    <TableBody>
                        <HeadingRow>I. Pendapatan Kotor</HeadingRow>

                        {inboundData
                            .filter(d => d.data.length > 0)
                            .map((data, i) => (
                                <ItemRow key={i} {...data} />
                            ))}

                        <TotalRow total={inboundTotalRp} />

                        <HeadingRow>II. Potongan</HeadingRow>

                        {outboundData
                            .filter(d => d.data.length > 0)
                            .map((data, i) => (
                                <ItemRow key={i} {...data} />
                            ))}

                        <TotalRow total={outboundTotalRp} />

                        <HeadingRow>III. Penerimaan Bersih</HeadingRow>

                        {[
                            {
                                name: 'Pendapatan Kotor',
                                data: inboundData.map(d => d.data).flat(),
                            },
                            {
                                name: 'Potongan',
                                data: outboundData.map(d => d.data).flat(),
                            },
                        ].map((data, i) => (
                            <ItemRow key={i} {...data} />
                        ))}

                        <TotalRow total={inboundTotalRp + outboundTotalRp} />
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

function ItemRow({ name, data }: { name: string; data: Transaction[] }) {
    return (
        <TableRow
            sx={{
                '*': {
                    fontSize: '0.75rem',
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
                    <Box>
                        {formatNumber(
                            data.reduce((acc, tx) => acc + tx.amount, 0),
                        )}
                    </Box>
                </Box>
            </TableCell>
        </TableRow>
    )
}

function HeadingRow({ children }: { children: ReactNode }) {
    return (
        <TableRow>
            <TableCell
                colSpan={2}
                sx={{
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    pt: 2,
                }}>
                {children}
            </TableCell>
        </TableRow>
    )
}

function TotalRow({ total }: { total: number }) {
    return (
        <TableRow
            sx={{
                '*': {
                    fontWeight: 'bold !important',
                },
            }}>
            <TableCell
                sx={{
                    textTransform: 'uppercase',
                    py: 1,
                }}>
                Total
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
