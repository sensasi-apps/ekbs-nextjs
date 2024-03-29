// types
import type LoanType from '@/dataTypes/Loan'
import type { OnRowClickType } from '@/components/Datatable'
import type { MUISortOptions } from 'mui-datatables'
import type { GetRowDataType } from '@/components/Datatable'
// vendors
import { useCallback } from 'react'
// components
import Datatable from '@/components/Datatable'
import DATATABLE_COLUMNS from './DATATABLE_COLUMNS'

let getRowData: GetRowDataType<LoanType>

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
                const data = getRowData(rowIndex)
                if (data) {
                    return onEdit(data)
                }
            }
        },
        [],
    )

    const API_URL =
        mode === 'manager' ? '/user-loans/datatable' : '/loans/datatable'

    const TITLE = mode === 'manager' ? 'Daftar Pinjaman' : 'Riwayat'

    const columns = [...DATATABLE_COLUMNS]

    if (mode === 'applier') {
        columns.splice(2, 1)
    }

    return (
        <Datatable
            apiUrl={API_URL}
            columns={columns}
            defaultSortOrder={DEFAULT_SORT_ORDER}
            onRowClick={handleRowClick}
            tableId="loans-table"
            title={TITLE}
            getRowDataCallback={fn => (getRowData = fn)}
        />
    )
}

export const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'proposed_at',
    direction: 'desc',
}
