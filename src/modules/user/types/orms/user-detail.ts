import type { Ymd } from '@/types/date-string'
import type { UUID } from 'crypto'
import type FileORM from '@/types/orms/file'
import type RegencyORM from '@/types/orms/regency'
import type DistrictORM from '@/types/orms/district'
import type VillageORM from '@/types/orms/village'
// enums
import type EducationEnum from '@/enums/education'
import type GenderEnum from '@/enums/gender'
import type MaritalStatusEnum from '@/enums/marital-status'

export default interface UserDetailORM {
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

    // relations
    birth_regency?: RegencyORM
    birth_district?: DistrictORM
    birth_village?: VillageORM
    files?: FileORM[]
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
