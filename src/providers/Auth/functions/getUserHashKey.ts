import { sha3_256 } from 'js-sha3'

export function getUserHashKey(email: string, password: string) {
    migrateUserHasKeyFromV1(email, password)

    return getUserHashKeyMainFn(email, password)
}

function getUserHashKeyMainFn(email: string, password: string) {
    return sha3_256(email + password)
}

function migrateUserHasKeyFromV1(email: string, password: string) {
    const oldHashKey = getUserHashKeyV1(email, password)
    const newHashKey = getUserHashKeyMainFn(email, password)

    const storedAuthInfoJson = localStorage.getItem(oldHashKey)

    if (storedAuthInfoJson) {
        localStorage.setItem(newHashKey, storedAuthInfoJson)
        localStorage.removeItem(oldHashKey)
    }
}

/**
 * @deprecated
 */
function getUserHashKeyV1(email: string, password: string) {
    return sha3_256(email.split('@')[0] + password)
}
