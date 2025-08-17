/**
 * Make sure this is sync with {@link https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Enums/Permission.php|permission enum on backend}
 */
enum Permission {
    READ = '[repair shop] read spare part',
    CREATE = '[repair shop] create spare part',
    UPDATE = '[repair shop] update spare part',
    DELETE = '[repair shop] delete spare part',
}

export default Permission
