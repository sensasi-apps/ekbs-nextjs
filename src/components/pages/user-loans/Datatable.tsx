// types
import type LoanType from '@/dataTypes/Loan'
import type { OnRowClickType } from '@/components/Datatable'
import type { MUISortOptions } from 'mui-datatables'
// vendors
import { useCallback } from 'react'
// components
import Datatable, { getDataRow } from '@/components/Datatable'
// locals
import DATATABLE_COLUMNS from './DATATABLE_COLUMNS'

export default function LoanDatatable({
    mode,
    onEdit,
}: {
    mode: 'applier' | 'manager'
    onEdit: (values: LoanType) => void
}) {
    const handleRowClick: OnRowClickType = useCallback(
        (_, { rowIndex }, event) => {
            if (event.detail === 2) {
                const data = getDataRow<LoanType>(rowIndex)
                if (data) {
                    return onEdit(data)
                }
            }
        },
        [],
    )

    const API_URL =
        mode === 'manager' ? '/user-loans/datatable' : '/loans/datatable'

    const TITLE =
        mode === 'manager'
            ? 'Daftar Pengajuan Pinjaman'
            : 'Riwayat Pinjaman Anda'

    return (
        <Datatable
            apiUrl={API_URL}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={DEFAULT_SORT_ORDER}
            onRowClick={handleRowClick}
            tableId="loans-table"
            title={TITLE}
        />
    )
}

export const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'proposed_at',
    direction: 'desc',
}
