import { UUID } from 'crypto'

export default function shortUuid(uuid: UUID): string {
    return uuid.slice(-6).toUpperCase()
}
