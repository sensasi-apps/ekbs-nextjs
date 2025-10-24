import type { UUID } from 'node:crypto'

export default interface FileORM {
    uuid: UUID
    alias: string
    mime: string
    extension: string
    size_kb: number
    fileable_classname?: string
    fileable_uuid?: UUID
}
