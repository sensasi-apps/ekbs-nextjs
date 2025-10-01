/**
 * Enum for user roles
 */
enum RoleEnum {
    // general
    COURIER = 'courier',
    DRIVER = 'driver',
    EMPLOYEE = 'employee',
    EXECUTIVE = 'executive',
    FARMER = 'farmer',
    MEMBER = 'member',

    // farm input
    FARM_INPUT_MANAGER = 'farm inputs manager',
    FARM_INPUT_WAREHOUSE_MANAGER = 'farm input warehouse manager',
    FARM_INPUT_PURCHASER = 'farm inputs purchaser',
    FARM_INPUT_SALES_MUAI_WAREHOUSE = 'farm input sales - muai warehouse',
    FARM_INPUT_SALES_PULAU_PINANG_WAREHOUSE = 'farm input sales - pulau pinang warehouse',

    // cash
    CASH_MANAGER = 'cashes manager',
    TRANSACTION_MANAGER = 'transactions manager',

    // heavy equipment rent
    HEAVY_EQUIPMENT_RENT_ADMIN = 'heavy equipment rent admin',
    HEAVY_EQUIPMENT_RENT_MANAGER = 'heavy equipment rent manager',
    HEAVY_EQUIPMENT_RENT_OPERATOR = 'heavy equipment rent operator',

    // inventory
    INVENTORY_ITEM_MANAGER = 'inventory item manager',

    // loan
    USER_LOAN_MANAGER = 'user loans manager',
    USER_LOAN_REVIEWER = 'user loans reviewer',
    USER_LOAN_DISBURSER = 'user loans disburser',
    USER_LOAN_INSTALLMENT_COLLECTOR = 'user loan installments collector',

    // palm bunch
    PALM_BUNCH_ADMIN = 'palm bunches admin',
    PALM_BUNCH_MANAGER = 'palm bunch head',

    // system
    USER_ADMIN = 'users admin',
    SYSTEM_CONFIGURATOR = 'system configurator',
    SUPERMAN = 'superman',

    // mart
    MART_MANAGER = 'mart manager',
    MART_CASHIER = 'mart cashier',

    // clm
    CLM_MANAGER = 'clm manager',
    CLM_ADMIN = 'clm admin',

    // repair shop
    REPAIR_SHOP_MANAGER = 'repair shop manager',
    REPAIR_SHOP_CASHIER = 'repair shop cashier',
}

export default RoleEnum
