// types
import type LoanType from '@/dataTypes/Loan'
import type { FormOpenStateType } from '@/pages/user-loans/reviews'
// vendors
import { useState } from 'react'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
// components
import useAuth from '@/providers/Auth'
import Datatable, { getDataRow } from '@/components/Datatable'
import DATATABLE_COLUMNS from '@/components/pages/user-loans/DATATABLE_COLUMNS'
import { DEFAULT_SORT_ORDER } from '@/components/pages/user-loans/Datatable'

enum ApiUrlEnum {
    All = '/user-loans/datatable',
    WaitForReview = '/user-loans/datatable?status=for-reviewer',
}

function UserLoanReviewDatatable({
    onSetReviewState,
}: {
    onSetReviewState: (openState: FormOpenStateType) => void
}) {
    const { user } = useAuth()

    const [apiUrl, setApiUrl] = useState(ApiUrlEnum.All)

    return (
        <>
            <Box display="flex" gap={1} mb={2}>
                <Chip
                    color={apiUrl === ApiUrlEnum.All ? 'success' : undefined}
                    label="Semua"
                    onClick={() => setApiUrl(ApiUrlEnum.All)}
                />

                <Chip
                    color={
                        apiUrl === ApiUrlEnum.WaitForReview
                            ? 'success'
                            : undefined
                    }
                    label="Menunggu Persetujuan"
                    onClick={() => setApiUrl(ApiUrlEnum.WaitForReview)}
                />
            </Box>

            <Datatable
                title="Daftar Pinjaman"
                tableId="review-user-loans-datatable"
                apiUrl={apiUrl}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const userLoan = getDataRow<LoanType>(dataIndex)
                        if (!userLoan) return

                        const userResponse = userLoan.responses.find(
                            response => response.by_user_uuid === user?.uuid,
                        )
                        const formData: FormOpenStateType['formData'] =
                            userResponse
                                ? {
                                      uuid: userResponse.uuid,
                                      user_loan_uuid: userLoan.uuid,
                                      is_approved: userResponse.is_approved,
                                  }
                                : {
                                      uuid: '',
                                      user_loan_uuid: userLoan.uuid,
                                      is_approved: '',
                                  }

                        onSetReviewState({
                            isDialogOpen: true,
                            userLoan,
                            formData,
                        })
                    }
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
            />
        </>
    )
}

export default UserLoanReviewDatatable
