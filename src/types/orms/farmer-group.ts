import type { UUID } from 'node:crypto'
import type CashType from './cash'

export default interface FarmerGroupORM {
    uuid: UUID
    name: string

    cash: CashType
}
