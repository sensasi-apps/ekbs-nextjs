// types
import type { ItemRow } from '@/components/pages/executive/profit-loss/Table'
import type { Tab } from '@/components/pages/executive/profit-loss/@types/tab'
// vendors
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
// global components
import AuthLayout from '@/components/Layouts/AuthLayout'
// page components
import { TabChips } from '@/components/pages/executive/profit-loss/tab-chips'
import Table from '@/components/pages/executive/profit-loss/Table'
// enums
import BusinessUnit from '@/enums/BusinessUnit'
import myAxios from '@/lib/axios'

const CURR_YEAR = dayjs().format('YYYY')

let isRecache = false

export default function ProfitLoss() {
    const { query } = useRouter()

    const activeTab = query.activeTab as Tab

    const {
        data: {
            general,
            palmBunch,
            heavyEquipmentRent,
            farmInput,
            userLoan,
        } = {},
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ApiResponseType>(
        [
            'executive/profit-loss-data',
            {
                year: query.year ?? CURR_YEAR,
            },
        ],
        args => fetcher(args[0] as string, args[1] as { year: string }),
    )

    return (
        <AuthLayout title="Laporan Laba-Rugi">
            <TabChips
                disabled={isLoading || isValidating}
                onRefreshClick={() => {
                    isRecache = true
                    mutate()
                }}
            />

            <Fade in={isValidating || isLoading}>
                <LinearProgress
                    sx={{
                        mt: 3,
                    }}
                />
            </Fade>

            <Fade in={!activeTab || activeTab === 'umum'} unmountOnExit>
                <div>
                    <Table
                        subtables={[
                            {
                                header: 'Pendapatan (I)',
                                data: general?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban (II)',
                                data: general?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: general?.incomes,
                            outcomes: general?.outcomes,
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'alat-berat'} unmountOnExit>
                <div>
                    <Table
                        subtables={[
                            {
                                header: 'Pendapatan (I)',
                                data: heavyEquipmentRent?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban (II)',
                                data: heavyEquipmentRent?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: heavyEquipmentRent?.incomes,
                            outcomes: heavyEquipmentRent?.outcomes,
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'saprodi'} unmountOnExit>
                <div>
                    <Table
                        subtables={[
                            {
                                header: 'Penjualan (I)',
                                data: farmInput?.sales,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Pembelian (II)',
                                data: farmInput?.purchases,
                                footer: 'Total (II)',
                            },
                            {
                                header: 'Persediaan',
                                data:
                                    farmInput?.stock_ins &&
                                    farmInput?.stock_outs
                                        ? [
                                              ...farmInput.stock_ins,
                                              ...farmInput.stock_outs,
                                          ]
                                        : undefined,
                                footer: 'Stok Akhir',
                            },
                            {
                                header: 'Beban (III)',
                                data: farmInput?.outcomes,
                                footer: 'Total (III)',
                            },
                        ]}
                        footer={{
                            incomes: farmInput?.sales,
                            outcomes: farmInput?.outcomes,
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'spp'} unmountOnExit>
                <div>
                    <Table
                        subtables={[
                            {
                                header: 'Pendapatan (I)',
                                data: userLoan?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban (II)',
                                data: userLoan?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: userLoan?.incomes,
                            outcomes: userLoan?.outcomes,
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'tbs'} unmountOnExit>
                <div>
                    <Table
                        subtables={[
                            {
                                header: 'Pendapatan (I)',
                                data: palmBunch?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban (II)',
                                data: palmBunch?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: palmBunch?.incomes,
                            outcomes: palmBunch?.outcomes,
                        }}
                    />
                </div>
            </Fade>
        </AuthLayout>
    )
}

async function fetcher(url: string, params: { year: string }) {
    return myAxios
        .get(url, {
            params: {
                ...params,
                recache: isRecache,
            },
        })
        .then(res => res.data)
}

interface ApiResponseType {
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

    [BusinessUnit.BELAYAN_MART]: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }

    general: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }
}
