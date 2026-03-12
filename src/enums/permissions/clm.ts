/**
 * All permission for clm module.
 *
 * Make sure this is sync with {@link https://github.com/sensasi-apps/ekbs-laravel/blob/main/Modules/Clm/app/Enums/Permission.php|permission enum on backend}
 */
enum Permission {
    READ_MASTER = '[clm] read master',
    CREATE_MASTER = '[clm] create master',
    UPDATE_MASTER = '[clm] update master',
    DELETE_MASTER = '[clm] delete master',

    READ_MEMBER = '[clm] read member',
    CREATE_MEMBER = '[clm] create member',
    UPDATE_MEMBER = '[clm] update member',
}

export default Permission
