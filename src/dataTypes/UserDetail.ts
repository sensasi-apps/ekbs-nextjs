import type { Ymd } from '@/types/DateString'
import type { UUID } from 'crypto'
import type File from './File'
import type RegencyType from './Regency'
import type DistrictType from './District'
import type VillageType from './Village'
// enums
import type EducationEnum from './enums/Education'
import type GenderEnum from './enums/Gender'
import type MaritalStatusEnum from './enums/MaritalStatus'

// type UserDetailType = UserDetailDBType | UserDetailDBTypeWithRelations
// export default UserDetailType

type UserDetailDBType = {
    uuid: UUID
    user_uuid: UUID
    citizen_id: string
    gender_id: GenderEnum
    birth_regency_id: number
    birth_district_id: number
    birth_village_id: number
    birth_at: Ymd
    last_education_id: EducationEnum
    marital_status_id: MaritalStatusEnum
    job_title: string
    job_desc: string
    n_children: number
    bpjs_kesehatan_no: string
}

export type UserDetailDBTypeWithRelations = UserDetailDBType &
    UserDetailRelationsType

export type UserDetailRelationsType = {
    birth_regency?: RegencyType
    birth_district?: DistrictType
    birth_village?: VillageType
    files?: File[]
    gender?: {
        id: GenderEnum
        name: string
        short_name: string
    }
    last_education?: {
        id: EducationEnum
        name: string
    }
    marital_status?: {
        id: MaritalStatusEnum
        name: string
    }
}
