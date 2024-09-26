import { sha3_256 } from 'js-sha3'

export function getUserHashKey(email: string, password: string) {
    return sha3_256(email.split('@')[0] + password)
}
