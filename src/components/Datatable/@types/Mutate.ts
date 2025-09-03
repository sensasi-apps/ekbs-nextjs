import type YajraDatatable from '@/types/yajra-datatable-response'
import type { KeyedMutator } from 'swr'

export type Mutate<T = unknown> = KeyedMutator<YajraDatatable<T>>
