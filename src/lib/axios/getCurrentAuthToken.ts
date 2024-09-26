import { getCurrentAuthInfo } from '@/providers/Auth/functions/getCurrentAuthInfo'

export function getCurrentAuthToken() {
    return getCurrentAuthInfo()?.access_token ?? null
}
