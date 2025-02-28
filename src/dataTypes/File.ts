import { type UUID } from 'crypto'

export default interface File {
    uuid: UUID
    alias: string
    mime: string
    extension: string
    size_kb: number
    fileable_classname?: string
    fileable_uuid?: UUID
}
