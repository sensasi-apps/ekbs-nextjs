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
                recache: query.recache ?? false,
            },
        ],
        fetcher,
    )

    return (
        <AuthLayout title="Laporan Laba-Rugi">
            <TabChips
                disabled={isLoading || isValidating}
                onRefreshClick={() => {
                    replace({
                        query: {
                            ...query,
                            recache: true,
                        },
                    })

                    mutate().then(() =>
                        replace({
                            query: {
                                ...query,
                                recache: false,
                            },
                        }),
                    )
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
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Pembelian',
                                data: belayanMart?.purchases,
                                footer: 'Total',
                            },
                            {
                                header: 'HPP',
                                data: belayanMart?.hpp,
                                footer: 'Total (II)',
                            },
                            {
                                header: 'Opname',
                                data: belayanMart?.opname,
                                footer: 'Total (III)',
                            },
                            {
                                header: 'Beban',
                                data: belayanMart?.outcomes,
                                footer: 'Total (IV)',
                            },
                        ]}
                        footer={{
                            incomes: [
                                ...(belayanMart?.sales ?? []),
                                ...(belayanMart?.opname ?? []),
                            ],
                            outcomes: [
                                ...(belayanMart?.outcomes ?? []),
                                ...(belayanMart?.hpp ?? []),
                            ],
                            info: '= I - II + III - IV',
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
                                footer: 'Total (I)',
                            },
                            {
                                header: 'Pembelian',
                                data: farmInput?.purchases,
                                footer: 'Total',
                            },
                            {
                                header: 'HPP',
                                data: farmInput?.hpp,
                                footer: 'Total (II)',
                            },
                            {
                                header: 'Opname',
                                data: farmInput?.opname,
                                footer: 'Total (III)',
                            },
                            {
                                header: 'Beban',
                                data: farmInput?.outcomes,
                                footer: 'Total (IV)',
                            },
                        ]}
                        footer={{
                            incomes: [
                                ...(farmInput?.sales ?? []),
                                ...(farmInput?.opname ?? []),
                            ],
                            outcomes: [
                                ...(farmInput?.outcomes ?? []),
                                ...(farmInput?.hpp ?? []),
                            ],
                            info: '= I - II + III - IV',
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
        outcomes: ItemRow[]
    }

    general: {
        incomes: ItemRow[]
        outcomes: ItemRow[]
    }
}
