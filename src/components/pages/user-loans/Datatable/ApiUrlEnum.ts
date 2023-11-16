enum UserLoanDatatableApiUrlEnum {
    ForApplier = '/loans/datatable',
    ForManager = '/user-loans/datatable',
    ForDisburser = '/user-loans/datatable?status=for-disburser',
    ForReviewer = '/user-loans/datatable?status=for-reviewer',
}

export default UserLoanDatatableApiUrlEnum
