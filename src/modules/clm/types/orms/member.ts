import type File from '@/dataTypes/File'
import type Requisite from '@/features/clm/types/requisite'
import type User from '@/features/user/types/user'
import type Land from '@/types/Land'
import type CertificationORM from '@/modules/clm/types/orms/certification'

export default interface MemberORM {
    user_uuid: string

    // relations
    certifications?: CertificationORM[]
    lands?: Land[]
    requisite_users?: RequisiteUserORM[]
    user?: User

    // attributes
    default_requisite_users?: RequisiteUserORM[]
}

interface RequisiteUserORM {
    user_uuid: string
    requisite_id: number

    // relations
    requisite?: Requisite
    files?: File[]
}
