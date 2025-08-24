import type File from '@/dataTypes/File'
import type Requisite from '@/features/clm/types/requisite'
import type User from '@/features/user/types/user'
//
import type CertificationORM from './certification'
import type LandORM from './land'

export default interface MemberORM {
    user_uuid: string

    // relations
    certifications?: CertificationORM[]
    lands?: LandORM[]
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
