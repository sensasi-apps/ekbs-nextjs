// types
import type { TableCellProps } from '@mui/material/TableCell'
// vendors
import {
    Box,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material'
import dayjs from 'dayjs'
// utils
import formatNumber from '@/utils/formatNumber'

export type ItemRow = {
    name: string
    data?: number[]
    info?: string
}

const HEADER_SX = {
    fontWeight: 'bold',
    fontSize: '0.8rem',
}

const monthNames: string[] = []

for (let i = 0; i < 12; i++) {
    monthNames.push(dayjs().month(i).format('MMMM'))
}

const emptyData = monthNames.map(() => 0)

export default function Table({
    subtables,
    footer,
}: {
    subtables: SubTableProps[]
    footer: {
        incomes?: ItemRow[]
        outcomes?: ItemRow[]
    }
}) {
    return (
        <TableContainer>
            <MuiTable size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Keterangan</TableCell>
                        {monthNames.map(monthName => (
                            <TableCell key={monthName}>{monthName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody
                    sx={{
                        '& > tr > td': {
                            whiteSpace: 'nowrap',
                        },
                    }}>
                    {subtables.map((subtable, i) => (
                        <SubTable key={i} {...subtable} />
                    ))}
                </TableBody>

                <CustomTableFooter {...footer} />
            </MuiTable>
        </TableContainer>
    )
}

interface SubTableProps {
    header: string
    data: ItemRow[] | undefined
    footer: string
}

function SubTable({ header, data, footer }: SubTableProps) {
    const sums: number[] =
        data?.[0].data?.map((_, i) =>
            data.reduce((acc, item) => acc + (item.data?.[i] ?? 0), 0),
        ) ?? emptyData

    return (
        <>
            <TableRow>
                <TableCell
                    colSpan={13}
                    sx={{ ...HEADER_SX, borderBottom: 'none' }}>
                    {header}
                </TableCell>
            </TableRow>

            {data?.map((item, i) => <CustomRow key={i} {...item} />)}

            <TableRow>
                <TableCell sx={HEADER_SX}>{footer}</TableCell>

                {sums.map((sum, i) => (
                    <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                ))}
            </TableRow>
        </>
    )
}

function CustomRow({ name, data, info }: ItemRow) {
    const SX_CELL_DATA = {
        borderBottom: 'none',
        py: 0.1,
    }

    return (
        <TableRow>
            <TableCell sx={SX_CELL_DATA}>
                {info ? (
                    <Tooltip title={info} arrow placement="right">
                        <span>{name}*</span>
                    </Tooltip>
                ) : (
                    name
                )}
            </TableCell>

            {data?.map((subItem, i) => (
                <RpItemCell
                    key={i}
                    data={subItem}
                    sx={{
                        ...SX_CELL_DATA,
                        color: subItem < 0 ? 'error.light' : undefined,
                    }}
                />
            ))}
        </TableRow>
    )
}

function CustomTableFooter({
    incomes,
    outcomes,
}: {
    incomes?: ItemRow[]
    outcomes?: ItemRow[]
}) {
    const incomeSums: number[] = monthNames.map(
        (_, i) =>
            incomes?.reduce(
                (acc, itemRow) => acc + (itemRow.data?.[i] ?? 0),
                0,
            ) ?? 0,
    )

    const outcomeSums: number[] = monthNames.map(
        (_, i) =>
            outcomes?.reduce(
                (acc, itemRow) => acc + (itemRow.data?.[i] ?? 0),
                0,
            ) ?? 0,
    )

    const diffs = incomeSums.map((iSum, i) => iSum - outcomeSums[i])
    const diffsPph25 = diffs.map(diff => diff * 0.1)
    const nets = diffs.map((diff, i) => diff - diffsPph25[i])

    return (
        <TableFooter>
            {[
                {
                    name: 'Laba Kotor',
                    data: diffs,
                },
                {
                    name: 'PPH Pasal 25 @10%',
                    data: diffsPph25,
                },
                {
                    name: 'PPH 23',
                    data: diffs.map(() => 0),
                },
                {
                    name: 'Laba Bersih Sebelum Pajak',
                    data: nets,
                },
            ].map((item, i) => (
                <CustomRow key={i} {...item} />
            ))}
        </TableFooter>
    )
}

function RpItemCell({
    sx,
    data,
}: Omit<TableCellProps, 'children'> & { data: number }) {
    return (
        <TableCell sx={sx} align="right">
            {data ? (
                <Box
                    display="flex"
                    gap={2}
                    component="span"
                    justifyContent="space-between">
                    <span>Rp.</span>

                    <span>{formatNumber(data)}</span>
                </Box>
            ) : (
                '-'
            )}
        </TableCell>
    )
}
