// vendors
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import ScrollableXBox from '@/components/ScrollableXBox'
// utils
import formatNumber from '@/utils/formatNumber'
import IconButton from '@/components/IconButton'
import RefreshIcon from '@mui/icons-material/Refresh'
import Skeletons from '@/components/Global/Skeletons'

type ItemRow = {
    name: string
    data: number[]
}

type TabType = 'alat-berat' | 'saprodi' | 'spp' | 'tbs'
const monthNames: string[] = []

type ApiResponseType = {
    heavyEquipmentRent: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }

    farmInput: {
        sales: ItemRow[]
        purchases: ItemRow[]
        stock_ins: ItemRow[]
        stock_outs: ItemRow[]
        outcomes: ItemRow[]
    }

    userLoan: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }

    palmBunch: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }
}

for (let i = 0; i < 12; i++) {
    monthNames.push(dayjs().month(i).format('MMMM'))
}

const CURR_YEAR = dayjs().format('YYYY')

export default function ProfitLoss() {
    const { query } = useRouter()

    const activeTab: TabType = query.activeTab as TabType

    const { data, isLoading, isValidating, mutate } = useSWR<ApiResponseType>([
        'executive/profit-loss-data',
        {
            year: query.year ?? CURR_YEAR,
        },
    ])

    return (
        <AuthLayout title="Laporan Laba-Rugi">
            <FlexColumnBox>
                <TabChips
                    disabled={isLoading || isValidating}
                    mutate={mutate}
                />

                <Fade in={isLoading} unmountOnExit>
                    <Skeletons />
                </Fade>

                <Fade
                    in={!activeTab || activeTab === 'alat-berat'}
                    unmountOnExit>
                    <div>
                        {data?.heavyEquipmentRent && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>
                                <AlatBeratTable
                                    data={data.heavyEquipmentRent}
                                />
                            </>
                        )}
                    </div>
                </Fade>

                <Fade in={activeTab === 'saprodi'} unmountOnExit>
                    <div>
                        {data?.farmInput && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>
                                <FarmInputTable data={data.farmInput} />
                            </>
                        )}
                    </div>
                </Fade>

                <Fade in={activeTab === 'spp'} unmountOnExit>
                    <div>
                        {data?.userLoan && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>
                                <UserLoanTable data={data.userLoan} />
                            </>
                        )}
                    </div>
                </Fade>

                <Fade in={activeTab === 'tbs'} unmountOnExit>
                    <div>
                        {data?.palmBunch && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>
                                <PalmBunchTable data={data.palmBunch} />
                            </>
                        )}
                    </div>
                </Fade>
            </FlexColumnBox>
        </AuthLayout>
    )
}

function TabChips({
    disabled,
    mutate,
}: {
    disabled: boolean
    mutate: () => any
}) {
    const { replace, query } = useRouter()

    function handleActiveTabChange(value?: TabType) {
        replace({
            query: {
                ...query,
                activeTab: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <Chip
                label="Alat Berat"
                disabled={disabled}
                onClick={() => handleActiveTabChange('alat-berat')}
                color={
                    !query.activeTab || query.activeTab === 'alat-berat'
                        ? 'success'
                        : undefined
                }
            />
            <Chip
                label="SAPRODI"
                disabled={disabled}
                onClick={() => handleActiveTabChange('saprodi')}
                color={query.activeTab === 'saprodi' ? 'success' : undefined}
            />
            <Chip
                label="SPP"
                disabled={disabled}
                onClick={() => handleActiveTabChange('spp')}
                color={query.activeTab === 'spp' ? 'success' : undefined}
            />
            <Chip
                label="TBS"
                disabled={disabled}
                onClick={() => handleActiveTabChange('tbs')}
                color={query.activeTab === 'tbs' ? 'success' : undefined}
            />

            <DatePicker
                disabled={disabled}
                slotProps={{
                    textField: {
                        fullWidth: false,
                    },
                }}
                sx={{
                    minWidth: '8rem',
                    maxWidth: '8rem',
                    ml: 2,
                }}
                label="Tahun"
                value={dayjs(query.year as string)}
                format="YYYY"
                onChange={date => {
                    replace({
                        query: {
                            ...query,
                            year: date?.format('YYYY') ?? CURR_YEAR,
                        },
                    })
                }}
                minDate={dayjs('2024')}
                maxDate={dayjs()}
                views={['year']}
            />

            <IconButton
                disabled={disabled}
                onClick={() => mutate()}
                title="Refresh"
                icon={RefreshIcon}
            />
        </ScrollableXBox>
    )
}

const HEADER_SX = {
    fontWeight: 'bold',
    fontSize: '0.8rem',
}

function HeaderRow({ children }: { children: React.ReactNode }) {
    return (
        <TableRow>
            <TableCell colSpan={13} sx={HEADER_SX}>
                {children}
            </TableCell>
        </TableRow>
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

const TB_BODY_SX = {
    '& > tr': {
        '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    },
    '& > tr > td': {
        whiteSpace: 'nowrap',
    },
}

function AlatBeratTable({
    data,
}: {
    data: ApiResponseType['heavyEquipmentRent']
}) {
    const incomeSums = data.incomes[0].data.map((_, i) =>
        data.incomes.reduce((acc, outcome) => acc + outcome.data[i], 0),
    )

    const outcomeSums = data.outcomes[0].data.map((_, i) =>
        data.outcomes.reduce((acc, outcome) => acc + outcome.data[i], 0),
    )

    const diffs = incomeSums.map((iSum, i) => iSum - outcomeSums[i])
    const diffsPph25 = diffs.map(diff => diff * 0.1)
    const nets = diffs.map((diff, i) => diff - diffsPph25[i])

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Keterangan</TableCell>
                        {monthNames.map(monthName => (
                            <TableCell key={monthName}>{monthName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody sx={TB_BODY_SX}>
                    <HeaderRow>Pendapatan (I)</HeaderRow>

                    {data.incomes.map((income, i) => (
                        <TableRow key={i}>
                            <TableCell>{income.name}</TableCell>

                            {income.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (I)</TableCell>

                        {incomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>

                    <HeaderRow>Beban (II)</HeaderRow>

                    {data.outcomes.map((outcome, i) => (
                        <TableRow key={i}>
                            <TableCell>{outcome.name}</TableCell>

                            {outcome.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (II)</TableCell>

                        {outcomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell>Laba Kotor</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH Pasal 25 @10%</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff * 0.1} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH 23</TableCell>

                        {diffs.map((_, i) => (
                            <RpItemCell key={i} data={0} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>Laba Bersih Setelah Pajak</TableCell>

                        {nets.map((net, i) => (
                            <RpItemCell key={i} data={net} />
                        ))}
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

function FarmInputTable({ data }: { data: ApiResponseType['farmInput'] }) {
    const saleSums = data.sales[0].data.map((_, i) =>
        data.sales.reduce((acc, itemRow) => acc + itemRow.data[i], 0),
    )

    const purchaseSums = data.purchases[0].data.map((_, i) =>
        data.purchases.reduce((acc, itemRow) => acc + itemRow.data[i], 0),
    )

    const stockInSums = data.stock_ins[0].data.map((_, i) =>
        data.stock_ins.reduce((acc, itemRow) => acc + itemRow.data[i], 0),
    )

    const stockOutSums = data.stock_outs[0].data.map((_, i) =>
        data.stock_outs.reduce((acc, itemRow) => acc + itemRow.data[i], 0),
    )

    const outcomeSums = data.outcomes[0].data.map((_, i) =>
        data.outcomes.reduce((acc, itemRow) => acc + itemRow.data[i], 0),
    )

    const diffs = saleSums.map((iSum, i) => iSum - outcomeSums[i])
    const diffsPph25 = diffs.map(diff => diff * 0.1)
    const nets = diffs.map((diff, i) => diff - diffsPph25[i])

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Keterangan</TableCell>
                        {monthNames.map(monthName => (
                            <TableCell key={monthName}>{monthName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody sx={TB_BODY_SX}>
                    <HeaderRow>Penjualan (I)</HeaderRow>

                    {data.sales.map((sale, i) => (
                        <TableRow key={i}>
                            <TableCell>{sale.name}</TableCell>

                            {sale.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (I)</TableCell>

                        {saleSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>

                    <HeaderRow>Pembelian (II)</HeaderRow>

                    {data.purchases.map((purchase, i) => (
                        <TableRow key={i}>
                            <TableCell>{purchase.name}</TableCell>

                            {purchase.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (II)</TableCell>

                        {purchaseSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>

                    <HeaderRow>Persediaan</HeaderRow>

                    {data.stock_ins.map((stock_in, i) => (
                        <TableRow key={i}>
                            <TableCell>{stock_in.name}</TableCell>

                            {stock_in.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    {data.stock_outs.map((itemRow, i) => (
                        <TableRow key={i}>
                            <TableCell>{itemRow.name}</TableCell>

                            {itemRow.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Stok Akhir</TableCell>

                        {stockInSums.map((sum, i) => (
                            <RpItemCell
                                sx={HEADER_SX}
                                key={i}
                                data={sum - stockOutSums[i]}
                            />
                        ))}
                    </TableRow>

                    <HeaderRow>Beban (III)</HeaderRow>

                    {data.outcomes.map((outcome, i) => (
                        <TableRow key={i}>
                            <TableCell>{outcome.name}</TableCell>

                            {outcome.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (III)</TableCell>

                        {outcomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell>Laba Kotor</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH Pasal 25 @10%</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff * 0.1} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH 23</TableCell>

                        {diffs.map((_, i) => (
                            <RpItemCell key={i} data={0} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>Laba Bersih Setelah Pajak</TableCell>

                        {nets.map((net, i) => (
                            <RpItemCell key={i} data={net} />
                        ))}
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

function UserLoanTable({ data }: { data: ApiResponseType['userLoan'] }) {
    const incomeSums = data.incomes[0].data.map((_, i) =>
        data.incomes.reduce((acc, outcome) => acc + outcome.data[i], 0),
    )

    const outcomeSums = data.outcomes[0].data.map((_, i) =>
        data.outcomes.reduce((acc, outcome) => acc + outcome.data[i], 0),
    )

    const diffs = incomeSums.map((iSum, i) => iSum - outcomeSums[i])
    const diffsPph25 = diffs.map(diff => diff * 0.1)
    const nets = diffs.map((diff, i) => diff - diffsPph25[i])

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Keterangan</TableCell>
                        {monthNames.map(monthName => (
                            <TableCell key={monthName}>{monthName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody sx={TB_BODY_SX}>
                    <HeaderRow>Pendapatan (I)</HeaderRow>

                    {data.incomes.map((income, i) => (
                        <TableRow key={i}>
                            <TableCell>{income.name}</TableCell>

                            {income.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (I)</TableCell>

                        {incomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>

                    <HeaderRow>Beban (II)</HeaderRow>

                    {data.outcomes.map((outcome, i) => (
                        <TableRow key={i}>
                            <TableCell>{outcome.name}</TableCell>

                            {outcome.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (II)</TableCell>

                        {outcomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell>Laba Kotor</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH Pasal 25 @10%</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff * 0.1} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH 23</TableCell>

                        {diffs.map((_, i) => (
                            <RpItemCell key={i} data={0} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>Laba Bersih Setelah Pajak</TableCell>

                        {nets.map((net, i) => (
                            <RpItemCell key={i} data={net} />
                        ))}
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

function PalmBunchTable({ data }: { data: ApiResponseType['palmBunch'] }) {
    const incomeSums = data.incomes[0].data.map((_, i) =>
        data.incomes.reduce((acc, outcome) => acc + outcome.data[i], 0),
    )

    const outcomeSums = data.outcomes[0].data.map((_, i) =>
        data.outcomes.reduce((acc, outcome) => acc + outcome.data[i], 0),
    )

    const diffs = incomeSums.map((iSum, i) => iSum - outcomeSums[i])
    const diffsPph25 = diffs.map(diff => diff * 0.1)
    const nets = diffs.map((diff, i) => diff - diffsPph25[i])

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Keterangan</TableCell>
                        {monthNames.map(monthName => (
                            <TableCell key={monthName}>{monthName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody sx={TB_BODY_SX}>
                    <HeaderRow>Pendapatan (I)</HeaderRow>

                    {data.incomes.map((income, i) => (
                        <TableRow key={i}>
                            <TableCell>{income.name}</TableCell>

                            {income.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (I)</TableCell>

                        {incomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>

                    <HeaderRow>Beban (II)</HeaderRow>

                    {data.outcomes.map((outcome, i) => (
                        <TableRow key={i}>
                            <TableCell>{outcome.name}</TableCell>

                            {outcome.data.map((item, j) => (
                                <RpItemCell key={j} data={item} />
                            ))}
                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell sx={HEADER_SX}>Total (II)</TableCell>

                        {outcomeSums.map((sum, i) => (
                            <RpItemCell sx={HEADER_SX} key={i} data={sum} />
                        ))}
                    </TableRow>
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell>Laba Kotor</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH Pasal 25 @10%</TableCell>
                        {diffs.map((diff, i) => (
                            <RpItemCell key={i} data={diff * 0.1} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>PPH 23</TableCell>

                        {diffs.map((_, i) => (
                            <RpItemCell key={i} data={0} />
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell>Laba Bersih Setelah Pajak</TableCell>

                        {nets.map((net, i) => (
                            <RpItemCell key={i} data={net} />
                        ))}
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
