'use client'

// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import BackButton from '@/components/back-button'
import DatePicker from '@/components/date-picker'
import FlexColumnBox from '@/components/flex-column-box'
import IconButton from '@/components/icon-button'
import InfoBox from '@/components/info-box'
import LoadingCenter from '@/components/loading-center'
import Link from '@/components/next-link'
import PageTitle from '@/components/page-title'
import PrintHandler from '@/components/print-handler'
import ScrollToTopFab from '@/components/scroll-to-top-fab'
import ScrollableXBox from '@/components/scrollable-x-box'
// types
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import formatNumber from '@/utils/format-number'
import getInstallmentType from '@/utils/get-installment-type'
// utils
import toDmy from '@/utils/to-dmy'

export default function ReceivableReport() {
    const searchParams = useSearchParams()

    const query = Object.fromEntries(searchParams?.entries() ?? [])

    const selectedDate = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    const { data, mutate, isLoading, isValidating } = useSWR<ApiResponseType>([
        'receivables/report',
        {
            month: selectedDate.format('MM'),
            type: query.type,
            year: selectedDate.format('YYYY'),
        },
    ])

    if (!data || isLoading || isValidating) return <LoadingCenter />

    return (
        <>
            <BackButton />

            <PageTitle title="Laporan Piutang" />

            <FlexColumnBox>
                <ScrollableXBox>
                    <MonthPicker />

                    <IconButton
                        icon={RefreshIcon}
                        onClick={() => mutate()}
                        title="Refresh"
                    />
                </ScrollableXBox>

                <TypeFilterChips />

                <span>
                    <PrintHandler
                        slotProps={{
                            printButton: {
                                color: 'success',
                            },
                        }}>
                        <Typography
                            align="center"
                            component="h6"
                            fontSize="1.2rem"
                            lineHeight={1.2}
                            mb={2}>
                            Laporan Angsuran{' '}
                            {getTypeName(query.type as StatusType)}
                            <br />
                            Bulan {selectedDate.format('MMMM YYYY')}
                        </Typography>

                        <MainTables data={data} />
                    </PrintHandler>
                </span>

                <MainTables data={data} />
            </FlexColumnBox>

            <ScrollToTopFab />
        </>
    )
}

type ApiResponseType = InstallmentORM[]

function MainTables({ data }: { data: ApiResponseType }) {
    const paidInstallments = data.filter(
        installment => installment.state === 'Lunas',
    )
    const etcInstallments = data.filter(
        installment => installment.state !== 'Lunas',
    )
    return (
        <div>
            <Box mb={2}>
                <Typography component="h2" variant="h6">
                    Angsuran Lunas
                </Typography>
                <InfoBox
                    data={[
                        {
                            label: 'Jumlah Angsuran',
                            value: formatNumber(paidInstallments.length),
                        },
                        {
                            label: 'Total Nilai',
                            value: formatNumber(
                                paidInstallments.reduce(
                                    (acc, installment) =>
                                        acc + installment.amount_rp,
                                    0,
                                ),
                            ),
                        },
                    ]}
                />
            </Box>

            <InstallmentTable data={paidInstallments} />

            <Box mb={2} mt={4}>
                <Typography component="h2" variant="h6">
                    Angsuran Lainnya
                </Typography>
                <InfoBox
                    data={[
                        {
                            label: 'Jumlah Angsuran',
                            value: formatNumber(etcInstallments.length),
                        },
                        {
                            label: 'Total Nilai',
                            value: formatNumber(
                                etcInstallments.reduce(
                                    (acc, installment) =>
                                        acc + installment.amount_rp,
                                    0,
                                ),
                            ),
                        },
                    ]}
                />
            </Box>

            <InstallmentTable data={etcInstallments} />
        </div>
    )
}

function InstallmentTable({ data }: { data: ApiResponseType }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>TGL. Jatuh Tempo</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell>Tipe</TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((installment, i) => {
                        const user = getUserFromInstallmentable(installment)

                        return (
                            <TableRow key={installment.uuid}>
                                <TableCell>{formatNumber(i + 1)}</TableCell>
                                <TableCell>
                                    {toDmy(installment.should_be_paid_at)}
                                </TableCell>
                                <TableCell>{user?.id}</TableCell>
                                <TableCell>{user?.name}</TableCell>
                                <TableCell>
                                    {getInstallmentType(installment)}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(installment.amount_rp)}
                                </TableCell>
                                <TableCell>{installment.state}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>TOTAL</TableCell>
                        <TableCell>
                            {formatNumber(
                                data.reduce(
                                    (acc, installment) =>
                                        acc + installment.amount_rp,
                                    0,
                                ),
                            )}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

const CURR_MONTH = dayjs().startOf('month')

function MonthPicker() {
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    const query = Object.fromEntries(searchParams?.entries() ?? [])

    const value = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    return (
        <>
            <DatePicker
                format="MMMM YYYY"
                label="Jatuh Tempo"
                maxDate={dayjs().startOf('month')}
                minDate={dayjs('2023-10-01')}
                onAccept={date => {
                    if (!date) return

                    const year = date.format('YYYY')
                    const month = date.format('MM')

                    replace(`?year=${year}&month=${month}`)
                }}
                openTo="month"
                slotProps={{
                    textField: {
                        fullWidth: false,
                    },
                }}
                sx={{
                    maxWidth: 300,
                }}
                value={value}
                views={['year', 'month']}
            />
        </>
    )
}

const CHIP_DEFAULT_PROPS = {
    component: Link,
    size: 'small',
} as const

function TypeFilterChips() {
    const searchParams = useSearchParams()
    const type = searchParams?.get('type')

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={Boolean(type)}
                color={type ? undefined : 'success'}
                href="?type="
                label="Semua"
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={type !== 'product-sale'}
                color={type === 'product-sale' ? 'success' : undefined}
                href="?type=product-sale"
                label="Penjualan Produk (SAPRODI)"
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={type !== 'user-loan'}
                color={type === 'user-loan' ? 'success' : undefined}
                href="?type=user-loan"
                label="Pinjaman (SPP)"
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={type !== 'rent-item-rent'}
                color={type === 'rent-item-rent' ? 'success' : undefined}
                href="?type=rent-item-rent"
                label="Sewa Alat Berat"
            />
        </ScrollableXBox>
    )
}

const getUserFromInstallmentable = (data: InstallmentORM) => {
    switch (data.installmentable_classname) {
        case 'App\\Models\\ProductSale':
            return data.product_sale?.buyer_user

        case 'App\\Models\\UserLoan':
            return data.user_loan?.user

        case 'App\\Models\\RentItemRent':
            return data.rent_item_rent?.by_user

        default:
            break
    }
}

type StatusType = 'rent-item-rent' | 'user-loan' | 'product-sale' | undefined

function getTypeName(type: StatusType) {
    switch (type) {
        case 'product-sale':
            return 'Penjualan Produk (SAPRODI)'
            break

        case 'user-loan':
            return 'Pinjaman (SPP)'
            break

        case 'rent-item-rent':
            return 'Sewa Alat Berat'
            break

        default:
            return ''
            break
    }
}
