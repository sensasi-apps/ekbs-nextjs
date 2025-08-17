/**
 * Make sure this is sync with {@link https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Enums/Permission.php|permission enum on backend}
 */
enum Permission {
    READ = '[repair shop] read sale',
    CREATE = '[repair shop] create sale',
    UPDATE = '[repair shop] update sale',
}

export default Permission
