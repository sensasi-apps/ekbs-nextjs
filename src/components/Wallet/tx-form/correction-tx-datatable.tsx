// vendors

import { green } from '@mui/material/colors'
import type { UUID } from 'crypto'
import type { ColumnDefinitionObject } from 'mui-datatable-delight'
// components
import Datatable from '@/components/data-table'
import formatNumber from '@/utils/format-number'
import shortUuid from '@/utils/short-uuid'
// utils
import toDmy from '@/utils/to-dmy'

export default function CorrectionTxDataTable({
    userUuid,
}: {
    userUuid: string
}) {
    return (
        <Datatable
            apiUrl={`/wallets/user/${userUuid}/correction-datatable-data`}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{ direction: 'desc', name: 'at' }}
            tableId="user-wallet-correction-tx-datatable"
            title="Daftar Koreksi"
        />
    )
}

const DATATABLE_COLUMNS: ColumnDefinitionObject[] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender: (value: UUID) => shortUuid(value),
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
        label: 'Nilai (Rp)',
        name: 'amount',
        options: {
            customBodyRender: (value: number) => (
                <span
                    style={{
                        color: value <= 0 ? 'inherit' : green[500],
                        whiteSpace: 'nowrap',
                    }}>
                    {formatNumber(value)}
                </span>
            ),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },
    {
        label: 'Keterangan',
        name: 'desc',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'pre',
                },
            }),
        },
    },
]
