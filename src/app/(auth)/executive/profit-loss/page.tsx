'use client'

// vendors
import { useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Fade from '@mui/material/Fade'
// components
import LoadingCenterLayout from '@/components/loading-center-layout'
// page components
import { TabChips } from '@/app/(auth)/executive/profit-loss/_components/tab-chips'
import Table, {
    type ItemRow,
} from '@/app/(auth)/executive/profit-loss/_components/table'
// enums
import BusinessUnit from '@/enums/BusinessUnit'
import myAxios from '@/lib/axios'
import FlexColumnBox from '@/components/FlexColumnBox'
import PageTitle from '@/components/page-title'
// import type { Metadata } from 'next'

const CURR_YEAR = dayjs().format('YYYY')

// export const metadata: Metadata = {
//     title: 'Laporan Laba-Rugi — ' + process.env.NEXT_PUBLIC_APP_NAME,
//     description: 'Laporan Laba-Rugi',
// }

export default function Page() {
    const isRecache = useRef(false)
    const searchParams = useSearchParams()
    const { activeTab = 'umum', year = CURR_YEAR } = Object.fromEntries(
        searchParams?.entries() ?? [],
    )

    const {
        data: {
            general,
            palmBunch,
            heavyEquipmentRent,
            farmInput,
            userLoan,
            [BusinessUnit.BELAYAN_MART]: belayanMart,
            [BusinessUnit.BENGKEL]: repairShop,
            [BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN]:
                sertifikasiDanPengelolaanKebun,
            [BusinessUnit.COFFEESHOP_DEPAN_KANTOR]: coffeeShopDepanKantor,
        } = {},
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ApiResponseType>(
        [
            'executive/profit-loss-data',
            {
                year: year,
                recache: isRecache.current,
            },
        ],
        fetcher,
    )

    if (isLoading || isValidating) return <LoadingCenterLayout />

    return (
        <FlexColumnBox gap={4}>
            <div>
                <PageTitle title="Laporan Laba-Rugi" subtitle={year} />
            </div>

            <TabChips
                disabled={isLoading || isValidating}
                onRefreshClick={() => {
                    isRecache.current = true

                    mutate()
                }}
                activeTab={activeTab}
                year={year}
            />

            <Table1WithFade name="umum" data={general} activeTab={activeTab} />

            <Table1WithFade
                name="alat-berat"
                data={heavyEquipmentRent}
                activeTab={activeTab}
            />

            <Table2WithFade
                name={BusinessUnit.BELAYAN_MART.toString()}
                data={belayanMart}
                activeTab={activeTab}
            />

            <Table2WithFade
                name="saprodi"
                data={farmInput}
                activeTab={activeTab}
            />
            <Table1WithFade name="spp" data={userLoan} activeTab={activeTab} />
            <Table1WithFade name="tbs" data={palmBunch} activeTab={activeTab} />
            <Table2WithFade
                name={BusinessUnit.BENGKEL.toString()}
                data={repairShop}
                activeTab={activeTab}
            />

            <Table1WithFade
                name={BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString()}
                data={sertifikasiDanPengelolaanKebun}
                activeTab={activeTab}
            />

            <Table1WithFade
                name={BusinessUnit.COFFEESHOP_DEPAN_KANTOR.toString()}
                data={coffeeShopDepanKantor}
                activeTab={activeTab}
            />
        </FlexColumnBox>
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

interface ApiResponseItemType1 {
    corrections: ItemRow['data'] | null
    incomes: ItemRow[]
    outcomes: ItemRow[]
}

interface ApiResponseItemType2 {
    corrections: ItemRow['data'] | null
    hpp: ItemRow[]
    opname: ItemRow[]
    outcomes: ItemRow[]
    purchases: ItemRow[]
    other_incomes: ItemRow[]
    sales: ItemRow[]
}

interface ApiResponseType {
    farmInput: ApiResponseItemType2
    general: ApiResponseItemType1
    heavyEquipmentRent: ApiResponseItemType1
    userLoan: ApiResponseItemType1
    palmBunch: ApiResponseItemType1

    [BusinessUnit.BELAYAN_MART]: ApiResponseItemType2
    [BusinessUnit.BENGKEL]: ApiResponseItemType2
    [BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN]: ApiResponseItemType1
    [BusinessUnit.COFFEESHOP_DEPAN_KANTOR]: ApiResponseItemType1
}

function calcMonthlyTotal(data: ItemRow[]): number[] {
    return data
        .map(item => item.data)
        .reduce(
            (acc, item) => acc.map((_, i) => acc[i] + (item?.[i] ?? 0)),
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        )
}

function Table1WithFade({
    name,
    data,
    activeTab,
}: {
    name: string
    data: ApiResponseItemType1 | undefined
    activeTab: string
}) {
    if (!data) return null

    const subTableProps = [
        {
            header: 'Pendapatan',
            data: data.incomes,
            footer: 'Total (I)',
        },
        {
            header: 'Beban',
            data: data.outcomes,
            footer: 'Total (II)',
        },
    ]

    if (data.corrections) {
        subTableProps.unshift({
            header: 'Koreksi',
            data: [
                {
                    name: 'Koreksi',
                    data: data.corrections,
                },
            ],
            footer: 'Total Koreksi',
        })
    }

    return (
        <Fade in={activeTab === name} unmountOnExit>
            <div>
                <Table
                    subTables={subTableProps}
                    footer={{
                        incomes: data.incomes,
                        outcomes: data.outcomes,
                        info: 'I - II',
                    }}
                />
            </div>
        </Fade>
    )
}

function Table2WithFade({
    name,
    data,
    activeTab,
}: {
    name: string
    data: ApiResponseItemType2 | undefined
    activeTab: string
}) {
    if (!data) return null

    const subTableProps = [
        {
            header: 'Penjualan',
            data: data?.sales,
            footer: 'Total',
        },
        {
            header: 'Pembelian',
            data: data?.purchases,
            footer: 'Total',
        },
        {
            header: 'Opname',
            data: data?.opname,
            footer: 'Total',
        },
        {
            header: 'HPP',
            data: data?.hpp,
            footer: 'Total',
        },
        {
            header: 'Laba Penjualan',
            data: [
                {
                    name: 'Total Penjualan',
                    data: calcMonthlyTotal(data?.sales ?? []),
                },
                {
                    name: '(-)Total HPP',
                    data: calcMonthlyTotal(data?.hpp ?? []).map(
                        total => total * -1,
                    ),
                },
            ],
            footer: 'Total (I)',
        },
        {
            header: 'Pendapatan Lain',
            data: data?.other_incomes,
            footer: 'Total (II)',
        },
        {
            header: 'Beban',
            data: data?.outcomes,
            footer: 'Total (III)',
        },
    ]

    if (data.corrections) {
        subTableProps.unshift({
            header: 'Koreksi',
            data: [
                {
                    name: 'Koreksi',
                    data: data.corrections,
                },
            ],
            footer: 'Total Koreksi',
        })
    }

    return (
        <Fade in={activeTab === name} unmountOnExit>
            <div>
                <Table
                    subTables={subTableProps}
                    footer={{
                        incomes: [
                            ...(data?.sales ?? []),
                            ...(data?.other_incomes ?? []),
                        ],
                        outcomes: [
                            ...(data?.outcomes ?? []),
                            ...(data?.hpp ?? []),
                        ],
                        info: '= I + II - III',
                    }}
                />
            </div>
        </Fade>
    )
}
