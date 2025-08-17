/**
 * Make sure this is sync with {@link https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Enums/Permission.php|permission enum on backend}
 */
enum Permission {
    READ = '[repair shop] read purchase',
    CREATE = '[repair shop] create purchase',
    UPDATE = '[repair shop] update purchase',
}

export default Permission
