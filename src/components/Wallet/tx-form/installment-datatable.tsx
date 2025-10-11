// vendors
import type { ColumnDefinitionObject } from 'mui-datatable-delight'
// components
import Datatable from '@/components/Datatable'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

export default function InstallmentDataTable({
    userUuid,
}: {
    userUuid: string
}) {
    return (
        <Datatable
            apiUrl={`/wallets/user/${userUuid}/installment-datatable-data`}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{ direction: 'desc', name: 'should_be_paid_at' }}
            tableId="user-wallet-installment-datatable"
            title="Daftar Angsuran"
        />
    )
}

const DATATABLE_COLUMNS: ColumnDefinitionObject[] = [
    {
        label: 'Kode',
        name: 'short_uuid',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Jatuh Tempo',
        name: 'should_be_paid_at',
        options: {
            customBodyRender: (value: string) => toDmy(value),
        },
    },
    {
        label: 'Unit Bisnis',
        name: 'business_unit',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Nilai (Rp)',
        name: 'amount_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },
    {
        label: 'Status',
        name: 'state',
        options: {
            searchable: false,
            sort: false,
        },
    },
]
