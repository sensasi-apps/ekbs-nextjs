import type BusinessUnit from '@/types/orms/business-unit'
import type BusinessUnitEnum from '@/enums/BusinessUnit'
import type { Ymd } from '@/types/DateString'

export default interface EmployeeORM {
    employee_status_id: EmployeeStatusId
    business_unit_id: BusinessUnitEnum
    joined_at: Ymd
    unjoined_at: Ymd | null
    unjoined_reason: string | null
    position: string
    note: string | null

    // relations
    employee_status?: {
        id: EmployeeStatusId
        name: string
    }

    business_unit?: BusinessUnit
}

enum EmployeeStatusId {
    MAGANG = 1,
    KONTRAK = 2,
    TETAP = 3,
    PENGURUS = 4,
}
