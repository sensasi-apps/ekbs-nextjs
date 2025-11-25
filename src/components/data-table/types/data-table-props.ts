import type {
    ColumnDefinitionObject,
    DataTableOptions,
} from 'mui-datatable-delight'
import type { SWRConfiguration } from 'swr'
import type { GetRowData } from './get-row-data'
import type { Mutate } from './mutate'
import type { OnRowClick } from './on-row-click'

export type DataTableProps<T = unknown> = {
    apiUrl: string
    apiUrlParams?: { [key: string]: string | number | undefined }
    columns: ColumnDefinitionObject<T>[]
    defaultSortOrder: {
        name: string
        direction: 'asc' | 'desc' | 'none'
    }
    tableId: string
    title?: string
    onRowClick?: OnRowClick
    mutateCallback?: (fn: Mutate<T>) => void
    getRowDataCallback?: (fn: GetRowData<T>) => void
    swrOptions?: SWRConfiguration
} & Omit<Partial<DataTableOptions<T>>, 'onRowClick'>
