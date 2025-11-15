// types

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
// vendors
import { useState } from 'react'
import type { FormOpenStateType } from '@/app/(auth)/loans/reviews/page'
// components
import Datatable, { getRowData } from '@/components/data-table'
import DATATABLE_COLUMNS from '@/components/pages/user-loans/DATATABLE_COLUMNS'
import { DEFAULT_SORT_ORDER } from '@/components/pages/user-loans/Datatable'
// hooks
import useAuthInfo from '@/hooks/use-auth-info'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'

enum ApiUrlEnum {
    All = '/user-loans/datatable',
    WaitForReview = '/user-loans/datatable?status=for-reviewer',
}

function UserLoanReviewDatatable({
    onSetReviewState,
}: {
    onSetReviewState: (openState: FormOpenStateType) => void
}) {
    const user = useAuthInfo()

    const [apiUrl, setApiUrl] = useState(ApiUrlEnum.WaitForReview)

    return (
        <>
            <Box display="flex" gap={1} mb={2}>
                <Chip
                    color={
                        apiUrl === ApiUrlEnum.WaitForReview
                            ? 'success'
                            : undefined
                    }
                    label="Menunggu Persetujuan"
                    onClick={() => setApiUrl(ApiUrlEnum.WaitForReview)}
                />

                <Chip
                    color={apiUrl === ApiUrlEnum.All ? 'success' : undefined}
                    label="Semua"
                    onClick={() => setApiUrl(ApiUrlEnum.All)}
                />
            </Box>

            <Datatable
                apiUrl={apiUrl}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const userLoan = getRowData<UserLoanORM>(dataIndex)
                        if (!userLoan) return

                        const userResponse = userLoan.responses?.find(
                            response => response.by_user_uuid === user?.uuid,
                        )
                        const formData: FormOpenStateType['formData'] =
                            userResponse
                                ? {
                                      is_approved: userResponse.is_approved,
                                      user_loan_uuid: userLoan.uuid,
                                      uuid: userResponse.uuid,
                                  }
                                : {
                                      is_approved: '',
                                      user_loan_uuid: userLoan.uuid,
                                      uuid: '',
                                  }

                        onSetReviewState({
                            formData,
                            isDialogOpen: true,
                            userLoan,
                        })
                    }
                }}
                tableId="review-user-loans-datatable"
                title="Daftar Pinjaman"
            />
        </>
    )
}

export default UserLoanReviewDatatable
