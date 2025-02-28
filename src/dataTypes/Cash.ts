import type { UUID } from 'crypto'

export default interface CashType {
    balance: number
    code: string
    name: string
    note?: string
    uuid: UUID
}
