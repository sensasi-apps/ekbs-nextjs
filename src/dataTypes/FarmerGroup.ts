import { type UUID } from 'crypto'
import type CashType from './Cash'

export default interface FarmerGroupType {
    uuid: UUID
    name: string

    cash: CashType
}
