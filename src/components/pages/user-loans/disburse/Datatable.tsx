// types

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
// vendors
import { useState } from 'react'
// components
import Datatable, { getRowData } from '@/components/data-table'
import DATATABLE_COLUMNS from '@/components/pages/user-loans/DATATABLE_COLUMNS'
import { DEFAULT_SORT_ORDER } from '@/components/pages/user-loans/Datatable'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'

function UserLoanDisburseDatatable({
    onEdit,
}: {
    onEdit: (userLoan: UserLoanORM) => void
}) {
    const [apiUrl, setApiUrl] = useState(
        UserLoanDatatableApiUrlEnum.ForDisburser,
    )

    return (
        <>
            <Box display="flex" gap={1} mb={2}>
                <Chip
                    color={
                        apiUrl === UserLoanDatatableApiUrlEnum.ForDisburser
                            ? 'success'
                            : undefined
                    }
                    label="Menunggu Pencairan"
                    onClick={() =>
                        setApiUrl(UserLoanDatatableApiUrlEnum.ForDisburser)
                    }
                />

                <Chip
                    color={
                        apiUrl === UserLoanDatatableApiUrlEnum.ForManager
                            ? 'success'
                            : undefined
                    }
                    label="Semua"
                    onClick={() =>
                        setApiUrl(UserLoanDatatableApiUrlEnum.ForManager)
                    }
                />
            </Box>

            <Datatable
                apiUrl={apiUrl}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData<UserLoanORM>(dataIndex)

                        if (data) {
                            onEdit(data)
                        }
                    }
                }}
                tableId="disburse-user-loans-datatable"
                title="Daftar Pinjaman"
            />
        </>
    )
}

export default UserLoanDisburseDatatable

enum UserLoanDatatableApiUrlEnum {
    // ForApplier = '/loans/datatable',
    ForManager = '/user-loans/datatable',
    ForDisburser = '/user-loans/datatable?status=for-disburser',
    // ForReviewer = '/user-loans/datatable?status=for-reviewer',
}
