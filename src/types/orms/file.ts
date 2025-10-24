import { type UUID } from 'crypto'

export default interface FileORM {
    uuid: UUID
    alias: string
    mime: string
    extension: string
    size_kb: number
    fileable_classname?: string
    fileable_uuid?: UUID
}
