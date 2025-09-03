import type { UUID } from 'crypto'

export default interface CashORM {
    balance: number
    code: string
    name: string
    note?: string
    uuid: UUID
}
