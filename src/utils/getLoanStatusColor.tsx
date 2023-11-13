import UserLoanStatusEnum from '@/dataTypes/UserLoan/StatusEnum'

type userLoanStatusColorType = 'warning' | 'success' | 'error' | undefined

const userLoanStatusColor: {
    [key in UserLoanStatusEnum]: userLoanStatusColorType
} = {
    [UserLoanStatusEnum.WaitingForApproval]: 'warning',
    [UserLoanStatusEnum.Rejected]: 'error',
    [UserLoanStatusEnum.WaitingForDisbursement]: 'warning',
    [UserLoanStatusEnum.Active]: 'success',
    [UserLoanStatusEnum.Finished]: undefined,
}

export default function getLoanStatusColor(
    status: UserLoanStatusEnum,
    suffix?: string,
): userLoanStatusColorType | string {
    if (userLoanStatusColor[status] === undefined) {
        return undefined
    }

    return `${userLoanStatusColor[status]}${suffix}`
}
