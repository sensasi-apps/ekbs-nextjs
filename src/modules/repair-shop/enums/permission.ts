/**
 * Make sure this is sync with {@link https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Enums/Permission.php|permission enum on backend}
 */
enum Permission {
    CREATE_SPARE_PART = '[repair shop] create spare part',
    READ_SPARE_PART = '[repair shop] read spare part',
    UPDATE_SPARE_PART = '[repair shop] update spare part',
    DELETE_SPARE_PART = '[repair shop] delete spare part',

    CREATE_SERVICE = '[repair shop] create service',
    READ_SERVICE = '[repair shop] read service',
    UPDATE_SERVICE = '[repair shop] update service',
    DELETE_SERVICE = '[repair shop] delete service',

    CREATE_PURCHASE = '[repair shop] create purchase',
    READ_PURCHASE = '[repair shop] read purchase',
    UPDATE_PURCHASE = '[repair shop] update purchase',

    CREATE_SALE = '[repair shop] create sale',
    READ_SALE = '[repair shop] read sale',
    UPDATE_SALE = '[repair shop] update sale',

    CREATE_SPARE_PART_QTY_ADJUSTMENT = '[repair shop] create spare part qty adjustment',
    READ_SPARE_PART_QTY_ADJUSTMENT = '[repair shop] read spare part qty adjustment',
    UPDATE_SPARE_PART_QTY_ADJUSTMENT = '[repair shop] update spare part qty adjustment',
    DELETE_SPARE_PART_QTY_ADJUSTMENT = '[repair shop] delete spare part qty adjustment',

    READ_RECEIVABLE = '[repair shop] read receivable',
    READ_CASH = '[repair shop] read cash',

    // unused for FE now
    // RETURN_SALE = '[repair shop] return spare part sale'
}

export default Permission
