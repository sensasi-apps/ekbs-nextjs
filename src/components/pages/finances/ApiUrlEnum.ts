enum FinanceApiUrlEnum {
    PAYROLL_DATATABLE_DATA = 'finances/payrolls/datatable-data',
    CREATE_PAYROLL = 'finances/payrolls/employees',
    PROCESS_PAYROLL = 'finances/payrolls/employees/$uuid/process',
    READ_PAYROLL = 'finances/payrolls/employees/$uuid',
    DELETE_PAYROLL = READ_PAYROLL,

    CREATE_PAYROLL_USERS = 'finances/payrolls/employees/$uuid/add-users',
    DELETE_PAYROLL_USER = 'finances/payrolls/employees/$payrollUuid/$payrollUserUuid',

    CREATE_PAYROLL_USER_DETAILS = 'finances/payrolls/employees/$payrollUuid/$payrollUserUuid/details',

    DEBT_DATATABLE_DATA = 'finances/debts/datatable-data',
    UPDATE_OR_CREATE_DEBT = 'finances/debts/$uuid',
    SETTLEMENT_DEBT = 'finances/debts/settlement/$uuid',
}

export default FinanceApiUrlEnum
