import type { UUID } from 'node:crypto'

export default interface CashORM {
    balance: number
    code: string
    name: string
    note?: string
    uuid: UUID
}
