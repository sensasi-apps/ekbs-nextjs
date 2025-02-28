import type User from '../User'

export default interface ProductMovementSale {
    buyer_user_uuid: User['uuid']
    no: number
    total_payment: number

    // relations
    buyer_user?: User
}
