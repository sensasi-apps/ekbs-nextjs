import type { UUID } from 'crypto'

type CashType = {
    balance: number
    code: string
    name: string
    note?: string
    uuid: UUID
}

export default CashType
