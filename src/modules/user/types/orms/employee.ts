import type { Ymd } from '@/types/date-string'
import type BusinessUnitORM from '@/types/orms/business-unit'
import type BusinessUnitEnum from '@/enums/business-unit'

export default interface EmployeeORM {
    employee_status_id: EmployeeStatusId
    business_unit_id: BusinessUnitEnum
    joined_at: Ymd
    unjoined_at: Ymd | null
    unjoined_reason: string | null
    position: string
    note: string | null

    // relations
    business_unit?: BusinessUnitORM
    employee_status?: {
        id: EmployeeStatusId
        name: string
    }
}

enum EmployeeStatusId {
    MAGANG = 1,
    KONTRAK = 2,
    TETAP = 3,
    PENGURUS = 4,
}
