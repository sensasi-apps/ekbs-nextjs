import type { UUID } from 'node:crypto'

export default function shortUuid(uuid: UUID, length = 7): string {
    return uuid.slice(-length).toUpperCase()
}
