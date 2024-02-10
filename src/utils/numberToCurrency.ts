export default function numberToCurrency(
    number: number,
    options?: Intl.NumberFormatOptions | undefined,
): string {
    return number.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        ...options,
    })
}
