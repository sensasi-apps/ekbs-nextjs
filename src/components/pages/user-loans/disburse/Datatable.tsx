// types
import type UserLoanType from '@/dataTypes/Loan'
// vendors
import { useState } from 'react'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
// components
import Datatable, { getDataRow } from '@/components/Datatable'
import DATATABLE_COLUMNS from '@/components/pages/user-loans/DATATABLE_COLUMNS'
import { DEFAULT_SORT_ORDER } from '@/components/pages/user-loans/Datatable'
import UserLoanDatatableApiUrlEnum from '../Datatable/ApiUrlEnum'

function UserLoanDisburseDatatable({
    onEdit,
}: {
    onEdit: (userLoan: UserLoanType) => void
}) {
    const [apiUrl, setApiUrl] = useState(UserLoanDatatableApiUrlEnum.ForManager)

    return (
        <>
            <Box display="flex" gap={1} mb={2}>
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
            </Box>

            <Datatable
                title="Daftar Pinjaman"
                tableId="disburse-user-loans-datatable"
                apiUrl={apiUrl}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getDataRow<UserLoanType>(dataIndex)

                        if (data) {
                            onEdit(data)
                        }
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
            />
        </>
    )
}

export default UserLoanDisburseDatatable
