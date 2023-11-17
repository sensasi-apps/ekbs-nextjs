export default function formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions,
) {
    return Intl.NumberFormat('id-ID', options).format(value)
}
