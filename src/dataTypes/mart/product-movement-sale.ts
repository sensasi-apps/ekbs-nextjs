import type User from '../User'

interface ProductMovementSale {
    buyer_user_uuid: User['uuid']
    no: number
    total_payment: number

    // relations
    buyer_user?: User
}

export default ProductMovementSale
