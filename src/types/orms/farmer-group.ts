import { type UUID } from 'crypto'
import type CashType from './cash'

export default interface FarmerGroupORM {
    uuid: UUID
    name: string

    cash: CashType
}
