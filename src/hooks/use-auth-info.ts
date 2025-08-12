import type AuthInfo from '@/features/user--auth/types/auth-info'
import { useLocalStorage } from '@uidotdev/usehooks'

export const LS_KEY = 'currentAuthInfo'

export default function useAuthInfo() {
    const [authInfo] = useLocalStorage<AuthInfo | undefined>(LS_KEY)

    return authInfo
}
