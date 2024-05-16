// types
import type { ItemRow } from '@/components/pages/executive/profit-loss/Table'
// vendors
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import IconButton from '@/components/IconButton'
import ScrollableXBox from '@/components/ScrollableXBox'
import Skeletons from '@/components/Global/Skeletons'
import Table from '@/components/pages/executive/profit-loss/Table'

type TabType = 'alat-berat' | 'saprodi' | 'spp' | 'tbs'

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

    const { palmBunch, heavyEquipmentRent, farmInput, userLoan } = data ?? {}

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
                        {heavyEquipmentRent && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>

                                <Table
                                    subtables={[
                                        {
                                            header: 'Pendapatan (I)',
                                            data: heavyEquipmentRent.incomes,
                                            footer: 'Total (I)',
                                        },
                                        {
                                            header: 'Beban (II)',
                                            data: heavyEquipmentRent.outcomes,
                                            footer: 'Total (II)',
                                        },
                                    ]}
                                    footer={{
                                        incomes: heavyEquipmentRent.incomes,
                                        outcomes: heavyEquipmentRent.outcomes,
                                    }}
                                />
                            </>
                        )}
                    </div>
                </Fade>

                <Fade in={activeTab === 'saprodi'} unmountOnExit>
                    <div>
                        {farmInput && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>

                                <Table
                                    subtables={[
                                        {
                                            header: 'Penjualan (I)',
                                            data: farmInput.sales,
                                            footer: 'Total (I)',
                                        },
                                        {
                                            header: 'Pembelian (II)',
                                            data: farmInput.purchases,
                                            footer: 'Total (II)',
                                        },
                                        {
                                            header: 'Persediaan',
                                            data: [
                                                ...farmInput.stock_ins,
                                                ...farmInput.stock_outs.map(
                                                    item => {
                                                        item.data =
                                                            item.data.map(
                                                                n => n * -1,
                                                            )

                                                        return item
                                                    },
                                                ),
                                            ],
                                            footer: 'Stok Akhir',
                                        },
                                        {
                                            header: 'Beban (III)',
                                            data: farmInput.outcomes,
                                            footer: 'Total (III)',
                                        },
                                    ]}
                                    footer={{
                                        incomes: farmInput.sales,
                                        outcomes: farmInput.outcomes,
                                    }}
                                />
                            </>
                        )}
                    </div>
                </Fade>

                <Fade in={activeTab === 'spp'} unmountOnExit>
                    <div>
                        {userLoan && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>
                                <Table
                                    subtables={[
                                        {
                                            header: 'Pendapatan (I)',
                                            data: userLoan.incomes,
                                            footer: 'Total (I)',
                                        },
                                        {
                                            header: 'Beban (II)',
                                            data: userLoan.outcomes,
                                            footer: 'Total (II)',
                                        },
                                    ]}
                                    footer={{
                                        incomes: userLoan.incomes,
                                        outcomes: userLoan.outcomes,
                                    }}
                                />
                            </>
                        )}
                    </div>
                </Fade>

                <Fade in={activeTab === 'tbs'} unmountOnExit>
                    <div>
                        {palmBunch && (
                            <>
                                <Fade in={isValidating} unmountOnExit>
                                    <LinearProgress />
                                </Fade>

                                <Table
                                    subtables={[
                                        {
                                            header: 'Pendapatan (I)',
                                            data: palmBunch.incomes,
                                            footer: 'Total (I)',
                                        },
                                        {
                                            header: 'Beban (II)',
                                            data: palmBunch.outcomes,
                                            footer: 'Total (II)',
                                        },
                                    ]}
                                    footer={{
                                        incomes: palmBunch.incomes,
                                        outcomes: palmBunch.outcomes,
                                    }}
                                />
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
