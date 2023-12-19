import { UUID } from 'crypto'
import CashType from './Cash'

type FarmerGroupType = {
    uuid: UUID
    name: string

    cash: CashType
}

export default FarmerGroupType
