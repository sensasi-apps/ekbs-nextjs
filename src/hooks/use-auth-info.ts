import { useLocalStorage } from '@uidotdev/usehooks'
import type AuthInfo from '@/modules/user/types/auth-info'

export const LS_KEY = 'currentAuthInfo'

export default function useAuthInfo() {
    const [authInfo] = useLocalStorage<AuthInfo | undefined>(LS_KEY)

    return authInfo
}
