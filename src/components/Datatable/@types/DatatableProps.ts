import type {
    ColumnDefinitionObject,
    DataTableOptions,
} from 'mui-datatable-delight'
import type { SWRConfiguration } from 'swr'
import type { OnRowClick } from './'
import type { GetRowData } from './GetRowData'
import type { Mutate } from './Mutate'

export type DatatableProps<T = unknown> = {
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
    mutateCallback?: (fn: Mutate<T>) => unknown
    getRowDataCallback?: (fn: GetRowData<T>) => unknown
    swrOptions?: SWRConfiguration
} & Omit<Partial<DataTableOptions<T>>, 'onRowClick'>
