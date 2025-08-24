import type User from '@/features/user/types/user'
//
import type CertificationORM from './certification'
import type LandORM from './land'
import type RequisiteUserORM from './requisite-user'

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
