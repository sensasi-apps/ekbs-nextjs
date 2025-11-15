'use client'

// materials
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
// vendors
import { useRef } from 'react'
import Endpoint from '@/app/(auth)/repair-shop/spare-part-purchases/_parts/enums/endpoint'
// components
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import Datatable from '@/components/Datatable'
import Fab from '@/components/fab'
import Link from '@/components/next-link'
import PageTitle from '@/components/page-title'
import TextShortener from '@/components/text-shortener'
// features
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

const getRowDataRef: {
    current?: GetRowDataType<SparePartMovement>
} = {}

export default function Page() {
    const { push } = useRouter()
    const mutateRef = useRef<MutateType<SparePartMovement> | undefined>(
        undefined,
    )

    return (
        <>
            <PageTitle title="Pembelian Stok" />

            <Fab component={Link} href="spare-part-purchases/create" />

            <Datatable<SparePartMovement>
                apiUrl={Endpoint.DATATABLE}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                mutateCallback={mutate => (mutateRef.current = mutate)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowDataRef.current?.(dataIndex)

                        if (data) {
                            push(
                                `/repair-shop/spare-part-purchases/${data.uuid}`,
                            )
                        }
                    }
                }}
                tableId="spare-part-datatable"
                title="Riwayat Pembelian"
            />
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<SparePartMovement>['columns'] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRef.current?.(dataIndex)

                if (!data) return ''

                return (
                    <>
                        {data.finalized_at ? (
                            ''
                        ) : (
                            <Chip
                                color="warning"
                                label="Draf"
                                size="small"
                                sx={{
                                    mr: 1,
                                }}
                                variant="outlined"
                            />
                        )}

                        <TextShortener text={data?.uuid as string} />
                    </>
                )
            },
        },
    },
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: value => toDmy(value),
        },
    },
    {
        label: 'Barang',
        name: 'details.sparePart.name',
        options: {
            customBodyRender: (_, rowIndex) => {
                const { details } = getRowDataRef.current?.(rowIndex) ?? {
                    details: [],
                }

                const spareParts = details
                    .slice(0, 10) // limiting only 10 to show for datatable
                    .map(detail => detail.spare_part_state)

                return (
                    <>
                        {spareParts.map(
                            sparePart =>
                                sparePart && (
                                    <Chip
                                        key={sparePart.code}
                                        label={sparePart.name}
                                        size="small"
                                    />
                                ),
                        )}

                        {details.length > 10 && (
                            <Typography
                                color="textSecondary"
                                component="div"
                                mt={2}
                                variant="caption">
                                ...dan {details.length - 10} lainnya
                            </Typography>
                        )}
                    </>
                )
            },
            sort: false,
        },
    },

    {
        label: 'Total Nilai (Rp)',
        name: 'sum_value_rp',
        options: {
            customBodyRender: (_, rowIndex) => {
                const { sum_value_rp, sum_cost_rp } = getRowDataRef.current?.(
                    rowIndex,
                ) ?? {
                    sum_cost_rp: 0,
                    sum_value_rp: 0,
                }

                return formatNumber(sum_value_rp + sum_cost_rp)
            },
            searchable: false,
            sort: false,
        },
    },

    {
        label: 'Catatan',
        name: 'note',
        options: {
            sort: false,
        },
    },
]
