import type { KeyedMutator } from 'swr'
import type YajraDatatable from '@/types/yajra-datatable-response'

export type Mutate<T = unknown> = KeyedMutator<YajraDatatable<T>>
