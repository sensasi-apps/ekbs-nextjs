import { getCurrentAuthInfo } from '@/utils/get-current-auth-info'

export function getCurrentAuthToken() {
    return getCurrentAuthInfo()?.access_token ?? null
}
