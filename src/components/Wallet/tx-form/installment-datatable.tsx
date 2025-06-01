// vendors
import type { ColumnDefinitionObject } from 'mui-datatable-delight'
// components
import Datatable from '@/components/Datatable'
// utils
import formatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'

export default function InstallmentDataTable({
    userUuid,
}: {
    userUuid: string
}) {
    return (
        <Datatable
            apiUrl={`/wallets/user/${userUuid}/installment-datatable-data`}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{ name: 'should_be_paid_at', direction: 'desc' }}
            tableId="user-wallet-installment-datatable"
            title="Daftar Angsuran"
        />
    )
}

const DATATABLE_COLUMNS: ColumnDefinitionObject[] = [
    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'should_be_paid_at',
        label: 'Jatuh Tempo',
        options: {
            customBodyRender: (value: string) => toDmy(value),
        },
    },
    {
        name: 'business_unit',
        label: 'Unit Bisnis',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'amount_rp',
        label: 'Nilai (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'state',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
        },
    },
]
