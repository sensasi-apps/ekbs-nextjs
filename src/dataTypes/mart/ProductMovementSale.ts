import type User from '../User'

type ProductMovementSale = {
    buyer_user_uuid: User['uuid']
    no: number
}

export default ProductMovementSale
