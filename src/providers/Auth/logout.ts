import axios from '@/lib/axios'
import { getCurrentAuthInfo } from './functions/getCurrentAuthInfo'

export async function logout(setUser: (user: null) => void) {
    const currentAuthInfo = getCurrentAuthInfo()

    if (currentAuthInfo?.should_revoke_access_token_on_logout) {
        await axios.post('/revoke-access-token')
    }

    localStorage.removeItem('currentAuthInfo')
    setUser(null)
}
