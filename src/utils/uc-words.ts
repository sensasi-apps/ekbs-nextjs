export default function ucWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase())
}
