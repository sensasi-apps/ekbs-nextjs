import type AuthInfo from '@/features/user--auth/types/auth-info'
import { useLocalStorage } from '@uidotdev/usehooks'
import { LS_KEY } from './use-auth-info'

export default function useAuthInfoState() {
    return useLocalStorage<AuthInfo | undefined>(LS_KEY)
}
