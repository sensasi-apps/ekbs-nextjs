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
    const { query, replace } = useRouter()

    const activeTab = query.activeTab as Tab

    const {
        data: {
            general,
            palmBunch,
            heavyEquipmentRent,
            farmInput,
            userLoan,
            [BusinessUnit.BELAYAN_MART]: belayanMart,
        } = {},
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ApiResponseType>(
        [
            'executive/profit-loss-data',
            {
                year: query.year ?? CURR_YEAR,
                recache: isRecache,
            },
        ],
        fetcher,
    )

    return (
        <AuthLayout title="Laporan Laba-Rugi">
            <TabChips
                disabled={isLoading || isValidating}
                onYearChange={date => {
                    isRecache = false

                    replace({
                        query: {
                            ...query,
                            year: (date ?? dayjs()).format('YYYY'),
                        },
                    })
                }}
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
                        subTables={[
                            {
                                header: 'Pendapatan',
                                data: general?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban',
                                data: general?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: general?.incomes,
                            outcomes: general?.outcomes,
                            info: 'I - II',
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'alat-berat'} unmountOnExit>
                <div>
                    <Table
                        subTables={[
                            {
                                header: 'Pendapatan',
                                data: heavyEquipmentRent?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban',
                                data: heavyEquipmentRent?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: heavyEquipmentRent?.incomes,
                            outcomes: heavyEquipmentRent?.outcomes,
                            info: 'I - II',
                        }}
                    />
                </div>
            </Fade>

            <Fade
                in={activeTab === BusinessUnit.BELAYAN_MART.toString()}
                unmountOnExit>
                <div>
                    <Table
                        subTables={[
                            {
                                header: 'Penjualan',
                                data: belayanMart?.sales,
                                footer: 'Total',
                            },
                            {
                                header: 'Pembelian',
                                data: belayanMart?.purchases,
                                footer: 'Total',
                            },
                            {
                                header: 'Opname',
                                data: belayanMart?.opname,
                                footer: 'Total',
                            },
                            {
                                header: 'HPP',
                                data: belayanMart?.hpp,
                                footer: 'Total',
                            },

                            {
                                header: 'Laba Penjualan',
                                data: [
                                    {
                                        name: 'Total Penjualan',
                                        data: calcMonthlyTotal(
                                            belayanMart?.sales ?? [],
                                        ),
                                    },
                                    {
                                        name: '(-)Total HPP',
                                        data: calcMonthlyTotal(
                                            belayanMart?.hpp ?? [],
                                        ).map(total => total * -1),
                                    },
                                ],
                                footer: 'Total (I)',
                            },

                            {
                                header: 'Pendapatan Lain',
                                data: belayanMart?.other_incomes,
                                footer: 'Total (II)',
                            },

                            {
                                header: 'Beban',
                                data: belayanMart?.outcomes,
                                footer: 'Total (III)',
                            },
                        ]}
                        footer={{
                            incomes: [...(belayanMart?.sales ?? [])],
                            outcomes: [
                                ...(belayanMart?.outcomes ?? []),
                                ...(belayanMart?.hpp ?? []),
                            ],
                            info: '= I + II - III',
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'saprodi'} unmountOnExit>
                <div>
                    <Table
                        subTables={[
                            {
                                header: 'Penjualan',
                                data: farmInput?.sales,
                                footer: 'Total',
                            },
                            {
                                header: 'Pembelian',
                                data: farmInput?.purchases,
                                footer: 'Total',
                            },
                            {
                                header: 'Opname',
                                data: farmInput?.opname,
                                footer: 'Total',
                            },
                            {
                                header: 'HPP',
                                data: farmInput?.hpp,
                                footer: 'Total',
                            },
                            {
                                header: 'Laba Penjualan',
                                data: [
                                    {
                                        name: 'Total Penjualan',
                                        data: calcMonthlyTotal(
                                            farmInput?.sales ?? [],
                                        ),
                                    },
                                    {
                                        name: '(-)Total HPP',
                                        data: calcMonthlyTotal(
                                            farmInput?.hpp ?? [],
                                        ).map(total => total * -1),
                                    },
                                ],
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Pendapatan Lain',
                                data: farmInput?.other_incomes,
                                footer: 'Total (II)',
                            },
                            {
                                header: 'Beban',
                                data: farmInput?.outcomes,
                                footer: 'Total (III)',
                            },
                        ]}
                        footer={{
                            incomes: [...(farmInput?.sales ?? [])],
                            outcomes: [
                                ...(farmInput?.outcomes ?? []),
                                ...(farmInput?.hpp ?? []),
                            ],
                            info: '= I + II - III',
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'spp'} unmountOnExit>
                <div>
                    <Table
                        subTables={[
                            {
                                header: 'Pendapatan',
                                data: userLoan?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban',
                                data: userLoan?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: userLoan?.incomes,
                            outcomes: userLoan?.outcomes,
                            info: 'I - II',
                        }}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'tbs'} unmountOnExit>
                <div>
                    <Table
                        subTables={[
                            {
                                header: 'Pendapatan',
                                data: palmBunch?.incomes,
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Beban',
                                data: palmBunch?.outcomes,
                                footer: 'Total (II)',
                            },
                        ]}
                        footer={{
                            incomes: palmBunch?.incomes,
                            outcomes: palmBunch?.outcomes,
                            info: 'I - II',
                        }}
                    />
                </div>
            </Fade>

            <Fade in={isValidating || isLoading}>
                <LinearProgress
                    sx={{
                        mt: 3,
                    }}
                />
            </Fade>
        </AuthLayout>
    )
}

async function fetcher(args: [string, { year: string; recache: boolean }]) {
    const url = args[0]
    const params = args[1]

    return myAxios
        .get(url, {
            params,
        })
        .then(res => res.data)
}

interface ApiResponseType {
    heavyEquipmentRent: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }

    farmInput: {
        hpp: ItemRow[]
        opname: ItemRow[]
        outcomes: ItemRow[]
        purchases: ItemRow[]
        other_incomes: ItemRow[]
        sales: ItemRow[]
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
        sales: ItemRow[]
        purchases: ItemRow[]
        hpp: ItemRow[]
        opname: ItemRow[]
        other_incomes: ItemRow[]
        outcomes: ItemRow[]
    }

    general: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }
}

function calcMonthlyTotal(data: ItemRow[]): number[] {
    return data
        .map(item => item.data)
        .reduce(
            (acc, item) => acc.map((_, i) => acc[i] + (item?.[i] ?? 0)),
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        )
}
