/**
 * Represents a user with role and permission information.
 */
class User {
    /**
     * Check if the user has a role with the specified roleNameId.
     *
     * @param {string} roleNameId - The name in ID lang of the role to check.
     * @returns {boolean} True if the user has the specified role; otherwise, false.
     * @throws {Error} Throws an error if role names ID is undefined (never fetched).
     */
    hasRoleId = roleNameId => {
        if (this.role_names_id === undefined)
            throw new Error('Roles ID is undefined / never fetched')

        return this.role_names_id.includes(roleNameId)
    }

    /**
     * Check if the user has a role with the specified roleName.
     *
     * @param {string} roleName - The name of the role to check.
     * @returns {boolean} True if the user has the specified role; otherwise, false.
     * @throws {Error} Throws an error if role names are undefined (never fetched).
     */
    hasRole = roleName => {
        if (this.role_names === undefined)
            throw new Error('Roles are undefined / never fetched')

        return this.role_names.includes(roleName)
    }

    /**
     * Check if the user has a permission with the specified permissionName.
     *
     * @param {string} permissionName - The name of the permission to check.
     * @returns {boolean} True if the user has the specified permission; otherwise, false.
     * @throws {Error} Throws an error if permission names are undefined (never fetched).
     */
    hasPermission = permissionName => {
        if (this.permission_names === undefined)
            throw new Error('Permissions are undefined / never fetched')

        return this.permission_names.includes(permissionName)
    }

    /**
     * Check if the user has a permission with the specified permissionName.
     *
     * @param {Array<string>} permissionNames - The names of the permission to check.
     * @returns {boolean} True if the user has the specified permission; otherwise, false.
     * @throws {Error} Throws an error if permission names are undefined (never fetched).
     */
    hasPermissions = permissionNames => {
        if (this.permission_names === undefined)
            throw new Error('Permissions are undefined / never fetched')

        return (
            this.permission_names.findIndex(permissionName =>
                permissionNames.includes(permissionName),
            ) !== -1
        )
    }

    /**
     * Creates a new User instance.
     *
     * @param {Object} props - The properties to initialize the User with.
     */
    constructor(props) {
        Object.assign(this, props)
    }
}

export default User
