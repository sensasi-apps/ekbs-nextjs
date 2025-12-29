/**
 * Converts an additional percentage to a float value.
 * @example
 * additionalPercentToFloat(10) // 1.1 is equal 110%
 */
export default function additionalPercentToFloat(additional: number) {
    return (additional + 100) / 100
}
