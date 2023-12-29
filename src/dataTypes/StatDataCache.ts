import type DataFreq from '@/enums/DataFreq'
import type { Ymd } from '@/types/DateString'

enum StatDataCacheKey {
    FARM_INPUT_SALE_RP = 'farmInputSaleRp',
    LOAN_DISBURSE_RP = 'loanDisburseRp',
    MEMBER_TOTAL = 'memberTotal',
    MEMBER_PARTICIPATION_TOTAL = 'memberParticipationTotal',
    PALM_BUNCH_KG = 'palmBunchKg',
    RENT_INCOME_RP = 'rentIncomeRp',
}

type StatDataCacheValueType =
    | number
    | {
          label: string
          value: number
      }[]

type StatDataCache = {
    key: StatDataCacheKey
    value: StatDataCacheValueType
    type: DataFreq
    description: string
    from_php_class: string
    from_php_function: string
    updated_at: Ymd
}

export default StatDataCache
