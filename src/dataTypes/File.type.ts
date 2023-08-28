import { UUID } from 'crypto'

type File = {
    uuid: UUID
    alias: string
    mime: string
    extension: string
    size_kb: number
    fileable_classname?: string
    fileable_uuid?: UUID
}

export default File
