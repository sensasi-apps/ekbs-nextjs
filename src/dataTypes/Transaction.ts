import { UUID } from 'crypto'
import { Moment } from 'moment'

type TransactionDataType = {
    uuid?: UUID
    id?: number
    at: Moment
    desc?: string
    amount?: number
    cashable_uuid: UUID
    cash: any
}

export default TransactionDataType
