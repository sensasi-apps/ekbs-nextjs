// vendors
import type { UUID } from 'crypto'
import type { ColumnDefinitionObject } from 'mui-datatable-delight'
import { green } from '@mui/material/colors'
// components
import Datatable from '@/components/Datatable'
// utils
import toDmy from '@/utils/toDmy'
import shortUuid from '@/utils/uuidToShort'
import formatNumber from '@/utils/formatNumber'

export default function CorrectionTxDataTable({
    userUuid,
}: {
    userUuid: string
}) {
    return (
        <Datatable
            apiUrl={`/wallets/user/${userUuid}/correction-datatable-data`}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{ name: 'at', direction: 'desc' }}
            tableId="user-wallet-correction-tx-datatable"
            title="Daftar Koreksi"
        />
    )
}

const DATATABLE_COLUMNS: ColumnDefinitionObject[] = [
    {
        name: 'uuid',
        label: 'Kode',
        options: {
            customBodyRender: (value: UUID) => shortUuid(value),
        },
    },
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender: (value: string) => toDmy(value),
        },
    },
    {
        name: 'amount',
        label: 'Nilai (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        color: value <= 0 ? 'inherit' : green[500],
                    }}>
                    {formatNumber(value)}
                </span>
            ),
        },
    },
    {
        name: 'desc',
        label: 'Keterangan',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'pre',
                },
            }),
        },
    },
]
