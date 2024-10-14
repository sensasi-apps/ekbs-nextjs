import type { AuthInfo } from '@/@types/Data/auth-info'

export function setCurrentAuthInfo(authInfo: AuthInfo) {
    if (typeof localStorage === 'undefined') {
        return
    }

    localStorage.setItem('currentAuthInfo', JSON.stringify(authInfo))
}
