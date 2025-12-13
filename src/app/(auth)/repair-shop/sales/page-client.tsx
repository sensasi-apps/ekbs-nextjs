'use client'

import Typography from '@mui/material/Typography'
import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
// vendors
import { useRouter } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useRef, useState } from 'react'
import Receipt from '@/app/(auth)/repair-shop/sales/_parts/components/receipt'
import ChipSmall from '@/components/chip-small'
// components
import ConfirmationDialogWithButton from '@/components/confirmation-dialog-with-button'
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
} from '@/components/data-table'
import PrintHandler from '@/components/print-handler'
import TextShortener from '@/components/text-shortener'
import axios from '@/lib/axios'
// features
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

let getRowDataRef: {
    current: GetRowDataType<Sale> | null
} = {
    current: null,
}

export default function PageClient() {
    const { push } = useRouter()
    getRowDataRef = useRef<GetRowDataType<Sale>>(null)

    return (
        <Datatable<Sale>
            apiUrl="repair-shop/sales/datatable"
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{ direction: 'desc', name: 'uuid' }}
            getRowDataCallback={fn => {
                getRowDataRef.current = fn
            }}
            onRowClick={(_, { dataIndex }, event) => {
                if (event.detail === 2) {
                    const data = getRowDataRef.current?.(dataIndex)

                    if (!data) return

                    push(`/repair-shop/sales/${data.uuid}`)
                }
            }}
            tableId="sales-datatable"
            title="Riwayat"
        />
    )
}

const DATATABLE_COLUMNS: DataTableProps<Sale>['columns'] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender: (value: string) => <TextShortener text={value} />,
        },
    },
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: (value: string) => toDmy(value),
        },
    },
    {
        label: 'Pelanggan',
        name: 'customer.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRef.current?.(dataIndex)

                if (!data?.customer) return

                return (
                    <>
                        <ChipSmall
                            color="info"
                            label={data.customer.id}
                            sx={{ mr: 1 }}
                            variant="outlined"
                        />
                        {data.customer.name}
                    </>
                )
            },
        },
    },
    {
        label: 'Total (Rp)',
        name: 'final_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Metode Pembayaran',
        name: 'payment_method',
        options: {
            customBodyRender: (value: Sale['payment_method']) => {
                if (value === 'cash') return 'Tunai'
                if (value === 'business-unit') return 'Unit Bisnis'
                if (value === 'installment') return 'Angsuran'

                return value
            },
        },
    },
    {
        label: 'catatan',
        name: 'note',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Kwitansi',
        name: '',
        options: {
            customBodyRender: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return null

                return (
                    <PrintHandler>
                        <Receipt data={data} />
                    </PrintHandler>
                )
            },
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Retur',
        name: '',
        options: {
            customBodyRender: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return null

                return <ReturnButtonCustomBodyRender data={data} />
            },
            display: false,
            searchable: false,
            sort: false,
        },
    },
]

function ReturnButtonCustomBodyRender({ data }: { data: Sale }) {
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    if (!data || !data.spare_part_movement_uuid) return null

    if (data.spare_part_movement_return)
        return (
            <Typography variant="caption">
                Suku cadang telah diretur pada tanggal{' '}
                <b>{data.spare_part_movement_return.at}</b>
            </Typography>
        )

    if (isSuccess)
        return (
            <Typography variant="caption">
                Suku cadang telah diretur pada tanggal{' '}
                <b>{dayjs().format('YYYY-MM-DD')}</b>
            </Typography>
        )

    return (
        <ConfirmationDialogWithButton
            buttonProps={{
                size: 'small',
                variant: 'outlined',
            }}
            buttonText="Retur"
            color="error"
            loading={loading}
            onConfirm={() => {
                setLoading(true)
                return returnSale(data.uuid)
                    .then(() => setIsSuccess(true))
                    .finally(() => setLoading(false))
            }}
            shouldConfirm
            title="Konfirmasi Retur">
            Retur hanya dapat dilakukan untuk suku cadang.
            <br />
            <br />
            Apakah anda yakin ingin melakukan retur?
        </ConfirmationDialogWithButton>
    )
}

async function returnSale(uuid: Sale['uuid']) {
    return axios
        .post(`/repair-shop/sales/${uuid}/return-sale`)
        .catch((error: AxiosError<LaravelValidationExceptionResponse>) => {
            enqueueSnackbar(error.response?.data.message ?? error.message, {
                variant: 'error',
            })
        })
}
