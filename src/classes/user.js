class User {
    role_names_id

    hasRoleId = roleNameId => {
        if (this.role_names_id === undefined)
            throw new Error('Role names id is undefined / never fetched')

        return this.role_names_id.includes(roleNameId)
    }

    hasRole = roleName => {
        if (this.role_names === undefined)
            throw new Error('Role names is undefined / never fetched')

        return this.role_names.includes(roleName)
    }

    constructor(props) {
        Object.assign(this, props)
    }
}

export default User
