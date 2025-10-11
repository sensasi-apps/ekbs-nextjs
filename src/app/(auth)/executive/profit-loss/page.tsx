'use client'

// materials
import Fade from '@mui/material/Fade'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
// vendors
import { useRef } from 'react'
import useSWR from 'swr'
// page components
import { TabChips } from '@/app/(auth)/executive/profit-loss/_components/tab-chips'
import Table, {
    type ItemRow,
} from '@/app/(auth)/executive/profit-loss/_components/table'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
// enums
import BusinessUnit from '@/enums/business-unit'
import myAxios from '@/lib/axios'

const CURR_YEAR = dayjs().format('YYYY')

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
                recache: isRecache.current,
                year: year,
            },
        ],
        fetcher,
    )

    if (isLoading || isValidating) return <LoadingCenter />

    return (
        <FlexColumnBox gap={4}>
            <div>
                <PageTitle subtitle={year} title="Laporan Laba-Rugi" />
            </div>

            <TabChips
                activeTab={activeTab}
                disabled={isLoading || isValidating}
                onRefreshClick={() => {
                    isRecache.current = true

                    mutate()
                }}
                year={year}
            />

            <Table1WithFade activeTab={activeTab} data={general} name="umum" />

            <Table1WithFade
                activeTab={activeTab}
                data={heavyEquipmentRent}
                name="alat-berat"
            />

            <Table2WithFade
                activeTab={activeTab}
                data={belayanMart}
                name={BusinessUnit.BELAYAN_MART.toString()}
            />

            <Table2WithFade
                activeTab={activeTab}
                data={farmInput}
                name="saprodi"
            />
            <Table1WithFade activeTab={activeTab} data={userLoan} name="spp" />
            <Table1WithFade activeTab={activeTab} data={palmBunch} name="tbs" />
            <Table2WithFade
                activeTab={activeTab}
                data={repairShop}
                name={BusinessUnit.BENGKEL.toString()}
            />

            <Table1WithFade
                activeTab={activeTab}
                data={sertifikasiDanPengelolaanKebun}
                name={BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString()}
            />

            <Table1WithFade
                activeTab={activeTab}
                data={coffeeShopDepanKantor}
                name={BusinessUnit.COFFEESHOP_DEPAN_KANTOR.toString()}
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
            data: data.incomes,
            footer: 'Total (I)',
            header: 'Pendapatan',
        },
        {
            data: data.outcomes,
            footer: 'Total (II)',
            header: 'Beban',
        },
    ]

    if (data.corrections) {
        subTableProps.unshift({
            data: [
                {
                    data: data.corrections,
                    name: 'Koreksi',
                },
            ],
            footer: 'Total Koreksi',
            header: 'Koreksi',
        })
    }

    return (
        <Fade in={activeTab === name} unmountOnExit>
            <div>
                <Table
                    footer={{
                        incomes: data.incomes,
                        info: 'I - II',
                        outcomes: data.outcomes,
                    }}
                    subTables={subTableProps}
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
            data: data?.sales,
            footer: 'Total',
            header: 'Penjualan',
        },
        {
            data: data?.purchases,
            footer: 'Total',
            header: 'Pembelian',
        },
        {
            data: data?.opname,
            footer: 'Total',
            header: 'Opname',
        },
        {
            data: data?.hpp,
            footer: 'Total',
            header: 'HPP',
        },
        {
            data: [
                {
                    data: calcMonthlyTotal(data?.sales ?? []),
                    name: 'Total Penjualan',
                },
                {
                    data: calcMonthlyTotal(data?.hpp ?? []).map(
                        total => total * -1,
                    ),
                    name: '(-)Total HPP',
                },
            ],
            footer: 'Total (I)',
            header: 'Laba Penjualan',
        },
        {
            data: data?.other_incomes,
            footer: 'Total (II)',
            header: 'Pendapatan Lain',
        },
        {
            data: data?.outcomes,
            footer: 'Total (III)',
            header: 'Beban',
        },
    ]

    if (data.corrections) {
        subTableProps.unshift({
            data: [
                {
                    data: data.corrections,
                    name: 'Koreksi',
                },
            ],
            footer: 'Total Koreksi',
            header: 'Koreksi',
        })
    }

    return (
        <Fade in={activeTab === name} unmountOnExit>
            <div>
                <Table
                    footer={{
                        incomes: [
                            ...(data?.sales ?? []),
                            ...(data?.other_incomes ?? []),
                        ],
                        info: '= I + II - III',
                        outcomes: [
                            ...(data?.outcomes ?? []),
                            ...(data?.hpp ?? []),
                        ],
                    }}
                    subTables={subTableProps}
                />
            </div>
        </Fade>
    )
}
