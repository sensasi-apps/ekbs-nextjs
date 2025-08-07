// vendors
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// materials
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import Fab from '@/components/Fab'
import TextShortener from '@/components/text-shortener'
// utils
import formatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'
// features
import type SparePartMovement from '@/features/repair-shop/types/spare-part-movement'
import Endpoint from '@/features/repair-shop--purchase/enums/endpoint'

const getRowDataRef: {
    current?: GetRowDataType<SparePartMovement>
} = {}

export default function Page() {
    const { push } = useRouter()
    const mutateRef = useRef<MutateType<SparePartMovement> | undefined>(
        undefined,
    )

    return (
        <AuthLayout title="Pembelian Stok">
            <Fab component={Link} href="spare-part-purchases/create" />

            <Datatable<SparePartMovement>
                apiUrl={Endpoint.DATATABLE}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                mutateCallback={mutate => (mutateRef.current = mutate)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowDataRef.current?.(dataIndex)

                        if (data) {
                            push(`spare-part-purchases/${data.uuid}`)
                        }
                    }
                }}
                title="Riwayat Pembelian"
                tableId="spare-part-datatable"
            />
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps<SparePartMovement>['columns'] = [
    {
        name: 'uuid',
        label: 'Kode',
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
                                size="small"
                                label="Draf"
                                variant="outlined"
                                color="warning"
                                sx={{
                                    mr: 1,
                                }}
                            />
                        )}

                        <TextShortener text={data?.uuid as string} />
                    </>
                )
            },
        },
    },
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender: value => toDmy(value),
        },
    },
    {
        name: 'details.sparePart.name',
        label: 'Barang',
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
                                        label={sparePart.name}
                                        size="small"
                                        key={sparePart.code}
                                    />
                                ),
                        )}

                        {details.length > 10 && (
                            <Typography
                                variant="caption"
                                component="div"
                                mt={2}
                                color="textSecondary">
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
        name: 'sum_value_rp',
        label: 'Total Nilai (Rp)',
        options: {
            customBodyRender: (_, rowIndex) => {
                const { sum_value_rp, sum_cost_rp } = getRowDataRef.current?.(
                    rowIndex,
                ) ?? {
                    sum_value_rp: 0,
                    sum_cost_rp: 0,
                }

                return formatNumber(sum_value_rp + sum_cost_rp)
            },
            searchable: false,
            sort: false,
        },
    },

    {
        name: 'note',
        label: 'Catatan',
        options: {
            sort: false,
        },
    },
]
