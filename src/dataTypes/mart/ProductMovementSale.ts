import type User from '../User'

type ProductMovementSale = {
    buyer_user_uuid: User['uuid']
    no: number

    // relations
    buyer_user?: User
}

export default ProductMovementSale
