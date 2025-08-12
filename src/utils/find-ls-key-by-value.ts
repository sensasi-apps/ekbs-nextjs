/**
 * Finds all keys in localStorage that exact match the given value.
 *
 * @param searchValue value to search for
 * @returns an array of keys in localStorage that match the given value
 */
export default function findLsKeyByValue(searchValue: unknown) {
    const matchingKeys = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)

        if (!key) {
            continue
        }

        const value = localStorage.getItem(key)

        if (value === searchValue) {
            matchingKeys.push(key)
        }
    }

    return matchingKeys
}
