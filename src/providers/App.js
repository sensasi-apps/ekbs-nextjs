import { createContext } from 'react'
import useAuth from './Auth'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const { data: user, error, mutate } = useAuth()

    function userHasPermission(permission) {
        return (
            user?.role_names?.includes('superman') ||
            (user?.permission_names?.length > 0 &&
                user?.permission_names?.includes(permission))
        )
    }

    function userHasRole(role) {
        return (
            user?.role_names?.includes('superman') ||
            (user?.role_names?.length > 0 && user?.role_names?.includes(role))
        )
    }

    return (
        <AppContext.Provider
            value={{
                auth: {
                    user,
                    error,
                    mutate,
                    userHasPermission,
                    userHasRole,
                },
            }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
