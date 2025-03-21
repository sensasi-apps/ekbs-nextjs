import type AuthInfo from '@/features/user--auth/types/auth-info'

export function setCurrentAuthInfo(authInfo: AuthInfo) {
    if (typeof localStorage === 'undefined') {
        return
    }

    localStorage.setItem('currentAuthInfo', JSON.stringify(authInfo))
}
