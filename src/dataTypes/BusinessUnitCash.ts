import type { UUID } from 'crypto'
import type BusinessUnit from './BusinessUnit'

export default interface BusinessUnitCash {
    uuid: UUID
    balance: number
    business_unit_id: number

    // relation
    business_unit?: BusinessUnit
}
