enum UserLoan {
    READ = 'read user loans',
    READ_NEED_REVIEW = 'read user loans need review',
    READ_NEED_DISBURSE = 'read user loans need disburse',
    READ_INSTALLMENT = 'read user loans installments',

    CREATE = 'create user loan',
    UPDATE = 'update user loan',
    DELETE = 'delete user loan',

    READ_OWN = 'read own loans',
    PURPOSE = 'purposing loan',
    UPDATE_OWN = 'update own loan',
    DELETE_OWN = 'delete own loan',

    REVIEW = 'review user loan',
    DISBURSE = 'disburse user loan',
    COLLECT_INSTALLMENT = 'collect user loan installment',

    READ_STATISTIC = 'read user loan statistic',
}

export default UserLoan
