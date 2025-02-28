import type { YajraDatatable } from '@/types/responses/YajraDatatable'
import type { KeyedMutator } from 'swr'

export type Mutate<T = unknown> = KeyedMutator<YajraDatatable<T>>
