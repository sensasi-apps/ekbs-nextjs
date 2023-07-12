export default function numberFormat(number, options = {}) {
    const { locale = 'id-ID', currency = 'IDR' } = options

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        minimumFractionDigits: 0,
        currency,
    }).format(number)
}
