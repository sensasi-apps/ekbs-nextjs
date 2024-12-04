// types
import type LoanType from '@/dataTypes/Loan'
import type {
    GetRowDataType,
    DatatableProps,
    OnRowClickType,
} from '@/components/Datatable'
import type { MUISortOptions } from 'mui-datatables'
// vendors
import { useCallback } from 'react'
// components
import Datatable from '@/components/Datatable'
import DATATABLE_COLUMNS from './DATATABLE_COLUMNS'

let getRowData: GetRowDataType<LoanType>

export default function LoanDatatable({
    mode,
    onEdit,
    apiUrlParams,
    mutateCallback,
}: {
    mode: 'applier' | 'manager'
    apiUrlParams?: DatatableProps['apiUrlParams']
    onEdit: (values: LoanType) => void
    mutateCallback?: DatatableProps['mutateCallback']
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
        [onEdit],
    )

    const API_URL =
        mode === 'manager' ? '/user-loans/datatable' : '/loans/datatable'

    const TITLE = mode === 'manager' ? 'Daftar Pinjaman' : 'Riwayat'

    if (mode === 'applier') {
        DATATABLE_COLUMNS.splice(3, 1)
    }

    return (
        <Datatable
            apiUrl={API_URL}
            apiUrlParams={apiUrlParams}
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={DEFAULT_SORT_ORDER}
            onRowClick={handleRowClick}
            tableId="loans-table"
            title={TITLE}
            getRowDataCallback={fn => (getRowData = fn)}
            mutateCallback={mutateCallback}
        />
    )
}

export const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'proposed_at',
    direction: 'desc',
}
