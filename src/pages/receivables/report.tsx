// types
import type { Installment } from '@/dataTypes/Installment'
// vendors
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Chip, { type ChipOwnProps } from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import BackButton from '@/components/BackButton'
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import InfoBox from '@/components/InfoBox'
import ScrollableXBox from '@/components/ScrollableXBox'
import Skeletons from '@/components/Global/Skeletons'
import IconButton from '@/components/IconButton'
import ScrollToTopFab from '@/components/ScrollToTopFab'
import PrintHandler from '@/components/PrintHandler'
// utils
import toDmy from '@/utils/toDmy'
import getInstallmentType from '@/utils/getInstallmentType'
import formatNumber from '@/utils/formatNumber'

export default function ReceivableReport() {
    const { query } = useRouter()

    const selectedDate = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    const { data, mutate, isLoading, isValidating } = useSWR<ApiResponseType>([
        'receivables/report',
        {
            year: selectedDate.format('YYYY'),
            month: selectedDate.format('MM'),
            type: query.type,
        },
    ])

    const disabled = isLoading || isValidating

    return (
        <AuthLayout title="Laporan Piutang">
            <BackButton />
            <FlexColumnBox>
                <ScrollableXBox>
                    <MonthPicker disabled={disabled} />

                    <IconButton
                        title="Refresh"
                        disabled={disabled}
                        icon={RefreshIcon}
                        onClick={() => mutate()}
                    />
                </ScrollableXBox>

                <TypeFilterChips disabled={disabled} />

                <Fade in={disabled} unmountOnExit>
                    <span>
                        <Skeletons />
                    </span>
                </Fade>

                {data && !isLoading && !isValidating && (
                    <>
                        <span>
                            <PrintHandler
                                slotProps={{
                                    printButton: {
                                        color: 'success',
                                    },
                                }}>
                                <Typography
                                    component="h6"
                                    fontSize="1.2rem"
                                    align="center"
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
                    </>
                )}
            </FlexColumnBox>

            <ScrollToTopFab />
        </AuthLayout>
    )
}

type ApiResponseType = Installment[]

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
                <Typography variant="h6" component="h2">
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
                <Typography variant="h6" component="h2">
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
                            <TableRow key={i}>
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

function MonthPicker({ disabled }: { disabled: boolean }) {
    const { query, replace } = useRouter()

    const value = dayjs(
        `${query.year ?? CURR_MONTH.format('YYYY')}-${query.month ?? CURR_MONTH.format('MM')}-01`,
    )

    return (
        <>
            <DatePicker
                disabled={disabled}
                label="Jatuh Tempo"
                openTo="month"
                format="MMMM YYYY"
                value={value}
                minDate={dayjs('2023-10-01')}
                maxDate={dayjs().startOf('month')}
                onAccept={date =>
                    date
                        ? replace({
                              query: {
                                  ...query,
                                  year: date?.format('YYYY'),
                                  month: date?.format('MM'),
                              },
                          })
                        : undefined
                }
                views={['year', 'month']}
                sx={{
                    maxWidth: 300,
                }}
                slotProps={{
                    textField: {
                        fullWidth: false,
                    },
                }}
            />
        </>
    )
}

const CHIP_DEFAULT_PROPS: ChipOwnProps = {
    size: 'small',
}

function TypeFilterChips({ disabled }: { disabled: boolean }) {
    const { replace, query } = useRouter()

    function handleTypeChange(value?: string) {
        replace({
            query: {
                ...query,
                type: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                disabled={disabled}
                label="Semua"
                onClick={() => handleTypeChange(undefined)}
                color={query.type ? undefined : 'success'}
            />
            <Chip
                disabled={disabled}
                {...CHIP_DEFAULT_PROPS}
                label="Penjualan Produk (SAPRODI)"
                onClick={() => handleTypeChange('product-sale')}
                color={query.type === 'product-sale' ? 'success' : undefined}
            />
            <Chip
                disabled={disabled}
                {...CHIP_DEFAULT_PROPS}
                label="Pinjaman (SPP)"
                onClick={() => handleTypeChange('user-loan')}
                color={query.type === 'user-loan' ? 'success' : undefined}
            />
            <Chip
                disabled={disabled}
                {...CHIP_DEFAULT_PROPS}
                label="Sewa Alat Berat"
                onClick={() => handleTypeChange('rent-item-rent')}
                color={query.type === 'rent-item-rent' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}

const getUserFromInstallmentable = (data: Installment) => {
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
