import type { SWRConfiguration } from 'swr'
import type { OnRowClick } from './'
import type { Mutate } from './Mutate'
import type { GetRowData } from './GetRowData'
import type {
    DataTableOptions,
    DataTableProps as VendorDataTableProps,
} from 'mui-datatable-delight'

export type DatatableProps<T = unknown> = {
    apiUrl: string
    apiUrlParams?: { [key: string]: string | number | undefined }
    columns: VendorDataTableProps<T>['columns']
    defaultSortOrder: {
        name: string
        direction: 'asc' | 'desc' | 'none'
    }
    tableId: string
    title?: string
    onRowClick?: OnRowClick
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutateCallback?: (fn: Mutate<any>) => unknown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowDataCallback?: (fn: GetRowData<any>) => unknown
    swrOptions?: SWRConfiguration
} & Omit<Partial<DataTableOptions<T>>, 'onRowClick'>
