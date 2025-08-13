export default function replaceNullPropValuesWithUndefined(
    obj: Record<string, unknown>,
) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc
        }

        return {
            ...acc,
            [key]: value,
        }
    }, {})
}
