import type User from '@/features/user/types/user'

export default interface ProductMovementSaleORM {
    buyer_user_uuid: User['uuid']
    no: number
    total_payment: number

    // relations
    buyer_user?: User
}
