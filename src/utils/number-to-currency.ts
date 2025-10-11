export default function numberToCurrency(
    number: number,
    options?: Intl.NumberFormatOptions | undefined,
): string {
    return number.toLocaleString('id-ID', {
        currency: 'IDR',
        minimumFractionDigits: 0,
        style: 'currency',
        ...options,
    })
}
