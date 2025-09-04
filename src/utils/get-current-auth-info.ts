import type AuthInfo from '@/modules/auth/types/auth-info'

export function getCurrentAuthInfo() {
    if (typeof localStorage === 'undefined') {
        return null
    }

    const currentAuthInfoJson = localStorage.getItem('currentAuthInfo')

    if (!currentAuthInfoJson) {
        return null
    }

    return JSON.parse(currentAuthInfoJson) as AuthInfo
}
