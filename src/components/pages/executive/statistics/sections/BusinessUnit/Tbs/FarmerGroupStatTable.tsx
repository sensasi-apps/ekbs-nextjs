// materials
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
// components
import { ApiResponseType } from '../Tbs'
import { TableBody, TableFooter } from '@mui/material'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

const CELL_SX_BORDER_LEFT = {
    borderLeft: '1px solid var(--mui-palette-TableCell-border)',
}

export default function FarmerGroupStatTable({
    data,
}: {
    data: ApiResponseType['palm_bunch_stat_per_farmer_group']
}) {
    const months: string[] = data
        .flatMap(items => items.flatMap(({ label }) => label))
        .filter((item, i, self) => i === self.indexOf(item))

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={3}>#</TableCell>
                        <TableCell rowSpan={3}>Kelompok Tani</TableCell>
                        <TableCell colSpan={months.length * 2}>
                            Kontribusi
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {months.map((monthName, i) => (
                            <TableCell
                                key={i}
                                colSpan={2}
                                align="center"
                                sx={CELL_SX_BORDER_LEFT}>
                                {monthName}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {months.map((_, i) => (
                            <WeightRpCols
                                key={i}
                                data1="Bobot"
                                data2="Nilai"
                                align="center"
                            />
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((items, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell
                                sx={{
                                    whiteSpace: 'nowrap',
                                }}>
                                {items[0].farmer_group_name ?? '-'}
                            </TableCell>

                            {months.map((month, i) => {
                                const { sum_kg, sum_rp } =
                                    items.find(
                                        ({ label }) => label === month,
                                    ) ?? {}

                                return (
                                    <WeightRpCols
                                        key={i}
                                        data1={
                                            formatNumber(sum_kg ?? 0) + ' kg'
                                        }
                                        data2={numberToCurrency(sum_rp ?? 0)}
                                    />
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>TOTAL</TableCell>

                        {months.map((month, i) => {
                            const items = data.flatMap(items =>
                                items.filter(({ label }) => label === month),
                            )
                            return (
                                <WeightRpCols
                                    key={i}
                                    data1={
                                        formatNumber(
                                            items.reduce(
                                                (acc, { sum_kg }) =>
                                                    acc + sum_kg,
                                                0,
                                            ) ?? 0,
                                        ) + ' kg'
                                    }
                                    data2={numberToCurrency(
                                        items.reduce(
                                            (acc, { sum_rp }) => acc + sum_rp,
                                            0,
                                        ) ?? 0,
                                    )}
                                />
                            )
                        })}
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

function WeightRpCols({
    data1,
    data2,
    align = 'right',
}: {
    data1: string
    data2: string
    align?: 'right' | 'center'
}) {
    return (
        <>
            <TableCell
                align={align}
                sx={{
                    whiteSpace: 'nowrap',
                    ...CELL_SX_BORDER_LEFT,
                }}>
                {data1}
            </TableCell>
            <TableCell
                align={align}
                sx={{
                    whiteSpace: 'nowrap',
                }}>
                {data2}
            </TableCell>
        </>
    )
}
