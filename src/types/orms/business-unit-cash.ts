import type { UUID } from 'node:crypto'
import type BusinessUnitORM from './business-unit'

export default interface BusinessUnitCashORM {
    uuid: UUID
    balance: number
    business_unit_id: number

    // relation
    business_unit?: BusinessUnitORM
}
