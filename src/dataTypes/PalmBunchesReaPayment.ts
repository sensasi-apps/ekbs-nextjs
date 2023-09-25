import { UUID } from 'crypto'
import { Moment } from 'moment'
import TransactionDataType from './Transaction'
import FileType from './File.type'

type PalmBunchesReaPaymentDataType = {
    uuid: UUID
    from_at: Moment
    to_at: Moment
    n_tickets: number
    gross_rp: number
    deduction_rp: number
    incentive_rp: number
    net_rp: number
    excel_file: FileType
    transaction_drafts: TransactionDataType[]
    transactions: TransactionDataType[]
}

export default PalmBunchesReaPaymentDataType
