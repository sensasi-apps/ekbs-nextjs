/**
 * Make sure this is sync with {@link https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/RepairShop/app/Enums/Permission.php|permission enum on backend}
 */
enum Permission {
    READ = '[repair shop] read service',
    CREATE = '[repair shop] create service',
    UPDATE = '[repair shop] update service',
    DELETE = '[repair shop] delete service',
}

export default Permission
