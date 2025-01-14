import type { SWRConfiguration } from 'swr'
import type { OnRowClick } from './'
import type { Mutate } from './Mutate'
import type { GetRowData } from './GetRowData'
import type {
    DataTableColumnObject,
    DataTableSortOrderOption,
} from 'mui-datatable-delight'

export type DatatableProps = {
    apiUrl: string
    apiUrlParams?: { [key: string]: string | number | undefined }
    columns: DataTableColumnObject[]
    defaultSortOrder: DataTableSortOrderOption
    tableId: string
    title?: string
    onRowClick?: OnRowClick
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutateCallback?: (fn: Mutate<any>) => unknown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowDataCallback?: (fn: GetRowData<any>) => unknown
    swrOptions?: SWRConfiguration
}
