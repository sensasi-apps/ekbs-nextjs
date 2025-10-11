import { useLocalStorage } from '@uidotdev/usehooks'
import type AuthInfo from '@/modules/user/types/auth-info'
import { LS_KEY } from './use-auth-info'

export default function useAuthInfoState() {
    return useLocalStorage<AuthInfo | undefined>(LS_KEY)
}
