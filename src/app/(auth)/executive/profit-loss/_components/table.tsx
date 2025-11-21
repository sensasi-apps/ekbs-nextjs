// vendors

// icons-materials
import InfoOutlined from '@mui/icons-material/InfoOutlined'
// materials
import Box from '@mui/material/Box'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { type TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow, { type TableRowProps } from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs'
import blinkSxValue from '@/utils/blink-sx-value'
// utils
import formatNumber from '@/utils/format-number'

export type ItemRow = {
    name: string
    data: number[]
    info?: string
}

const monthNames: string[] = []

for (let i = 0; i < 12; i++) {
    monthNames.push(dayjs().month(i).format('MMMM'))
}

export default function Table({
    subTables,
    footer,
}: {
    subTables: SubTableProps[]
    footer: {
        incomes?: ItemRow[]
        outcomes?: ItemRow[]
        info?: string
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
                    {subTables.map(subTable => (
                        <SubTable key={subTable.header} {...subTable} />
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

const HEADER_SX = {
    fontSize: '0.8rem',
    fontWeight: 'bold',
}

const emptyData = monthNames.map(monthName => ({
    key: monthName,
    value: 0,
}))

function SubTable({ header, data, footer }: SubTableProps) {
    const sums: {
        key: string
        value: number
    }[] =
        data?.[0]?.data?.map((_, i) => ({
            key: monthNames[i],
            value: data.reduce((acc, item) => acc + (item.data?.[i] ?? 0), 0),
        })) ?? emptyData

    return (
        <>
            <TableRow>
                <TableCell
                    colSpan={13}
                    sx={{
                        ...HEADER_SX,
                        borderBottom: 'none',
                        ...(header === 'Koreksi' ? blinkSxValue : {}),
                    }}>
                    {header}
                </TableCell>
            </TableRow>

            {data?.map(item => (
                <CustomRow
                    key={item.name}
                    sxRow={header === 'Koreksi' ? blinkSxValue : undefined}
                    {...item}
                />
            ))}

            <TableRow sx={header === 'Koreksi' ? blinkSxValue : undefined}>
                <TableCell sx={HEADER_SX}>{footer}</TableCell>

                {sums.map(sum => (
                    <RpItemCell data={sum.value} key={sum.key} sx={HEADER_SX} />
                ))}
            </TableRow>
        </>
    )
}

function CustomRow({
    name,
    data,
    info,
    sxRow,
}: ItemRow & {
    sxRow?: TableRowProps['sx']
}) {
    const SX_CELL_DATA = {
        borderBottom: 'none',
        py: 0.1,
    }

    const dataWithKey = data.map((value, i) => ({
        key: `${name}-data-${i}`,
        value,
    }))

    return (
        <TableRow sx={sxRow}>
            <TableCell sx={SX_CELL_DATA}>
                {info ? (
                    <Tooltip arrow placement="right" title={info}>
                        <Box
                            component="span"
                            sx={{
                                textDecoration: 'underline',
                                textDecorationStyle: 'dashed',
                            }}>
                            {name}{' '}
                            <InfoOutlined
                                sx={{
                                    fontSize: '1em',
                                    verticalAlign: 'text-top',
                                }}
                            />
                        </Box>
                    </Tooltip>
                ) : (
                    name
                )}
            </TableCell>

            {dataWithKey.map(({ key, value }) => (
                <RpItemCell data={value} key={key} sx={SX_CELL_DATA} />
            ))}
        </TableRow>
    )
}

function CustomTableFooter({
    outcomes,
    incomes,
    info,
}: {
    outcomes?: ItemRow[]
    incomes?: ItemRow[]
    info?: string
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
                    data: diffs,
                    info: info,
                    name: 'Laba Kotor',
                },
                {
                    data: diffsPph25,
                    name: 'PPH Pasal 25 @10%',
                },
                {
                    data: diffs.map(() => 0),
                    name: 'PPH 23',
                },
                {
                    data: nets,
                    name: 'Laba Bersih Sebelum Pajak',
                },
            ].map(item => (
                <CustomRow key={item.name} {...item} />
            ))}
        </TableFooter>
    )
}

function RpItemCell({
    sx,
    data,
}: Omit<TableCellProps, 'children'> & { data: number }) {
    return (
        <TableCell
            align="right"
            sx={{
                ...sx,
                color: data < 0 ? 'error.light' : undefined,
            }}>
            {data ? (
                <Box
                    component="span"
                    display="flex"
                    gap={2}
                    justifyContent="space-between">
                    <span>Rp.</span>

                    <span>
                        {formatNumber(data, {
                            maximumFractionDigits: 0,
                        })}
                    </span>
                </Box>
            ) : (
                '-'
            )}
        </TableCell>
    )
}
