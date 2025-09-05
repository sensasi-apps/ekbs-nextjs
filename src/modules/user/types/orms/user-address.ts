import type AddressORM from '@/types/orms/address'

export default interface UserAddressORM {
    name: string
    address: AddressORM
    uuid: string
}
