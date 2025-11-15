import type { KeyedMutator } from 'swr'
import type YajraDataTable from '@/types/yajra-data-table-response'

export type Mutate<T = unknown> = KeyedMutator<YajraDataTable<T>>
