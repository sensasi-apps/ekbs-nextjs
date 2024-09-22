enum LocaleEnum {
    ID = 'id',
}

const cache: {
    [locale: string]: {
        [scope: string]: {
            [key: string]: string
        }
    }
} = {}

const __ = (
    key: string,
    scope: string = 'index',
    locale: LocaleEnum = LocaleEnum.ID,
) => {
    if (!cache[locale]) cache[locale] = {}

    if (!cache[locale][scope])
        import(`./${locale}/${scope}.json`).then(data => {
            cache[locale][scope] = data
        })

    return cache[locale][scope][key] || key
}

export default __
