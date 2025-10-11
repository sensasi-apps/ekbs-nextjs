// types

// vendors
import { useCallback } from 'react'
import type {
    DatatableProps,
    GetRowDataType,
    OnRowClickType,
} from '@/components/Datatable'
// components
import Datatable from '@/components/Datatable'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import DATATABLE_COLUMNS from './DATATABLE_COLUMNS'

let getRowData: GetRowDataType<UserLoanORM>

export default function LoanDatatable({
    mode,
    onEdit,
    apiUrlParams,
    mutateCallback,
}: {
    mode: 'applier' | 'manager'
    apiUrlParams?: DatatableProps<UserLoanORM>['apiUrlParams']
    onEdit: (values: UserLoanORM) => void
    mutateCallback?: DatatableProps<UserLoanORM>['mutateCallback']
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
            download
            getRowDataCallback={fn => (getRowData = fn)}
            mutateCallback={mutateCallback}
            onRowClick={handleRowClick}
            tableId="loans-table"
            title={TITLE}
        />
    )
}

export const DEFAULT_SORT_ORDER = {
    direction: 'desc' as const,
    name: 'proposed_at',
}
