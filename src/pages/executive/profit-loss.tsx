// types
import type { ItemRow } from '@/components/pages/executive/profit-loss/Table'
// vendors
import { useRef } from 'react'
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
    const isRecache = useRef(false)

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
        } = {},
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ApiResponseType>(
        [
            'executive/profit-loss-data',
            {
                year: query.year ?? CURR_YEAR,
                recache: isRecache.current,
            },
        ],
        fetcher,
    )

    return (
        <AuthLayout title="Laporan Laba-Rugi">
            <TabChips
                disabled={isLoading || isValidating}
                onYearChange={date => {
                    isRecache.current = false

                    replace({
                        query: {
                            ...query,
                            year: (date ?? dayjs()).format('YYYY'),
                        },
                    })
                }}
                onRefreshClick={() => {
                    isRecache.current = true

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

            <Table1WithFade name="umum" data={general} />

            <Table1WithFade name="alat-berat" data={heavyEquipmentRent} />

            <Table2WithFade
                name={BusinessUnit.BELAYAN_MART.toString()}
                data={belayanMart}
            />

            <Table2WithFade name="saprodi" data={farmInput} />
            <Table1WithFade name="spp" data={userLoan} />
            <Table1WithFade name="tbs" data={palmBunch} />
            <Table2WithFade
                name={BusinessUnit.BENGKEL.toString()}
                data={repairShop}
            />

            <Table1WithFade
                name={BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString()}
                data={sertifikasiDanPengelolaanKebun}
            />

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
}: {
    name: string
    data: ApiResponseItemType1 | undefined
}) {
    const { query } = useRouter()

    if (!data) return null

    const isIn =
        query.activeTab === name || (!query.activeTab && name === 'umum')

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
        <Fade in={isIn} unmountOnExit>
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
}: {
    name: string
    data: ApiResponseItemType2 | undefined
}) {
    const { query } = useRouter()

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
        <Fade in={query.activeTab === name} unmountOnExit>
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
