const cache = {}

const __ = (key, scope, locale = 'id') => {
    if (!cache[locale]) cache[locale] = {}

    if (!cache[locale][scope])
        cache[locale][scope] = require(`./${locale}/${scope}.json`)

    return cache[locale][scope][key] || key
}

export default __
