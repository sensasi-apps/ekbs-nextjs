import type { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'
import type { SWRConfiguration } from 'swr'
import type { OnRowClick } from './OnRowClick'
import type { Mutate } from './Mutate'
import type { GetRowData } from './GetRowData'

export type DatatableProps = {
    apiUrl: string
    apiUrlParams?: { [key: string]: string | number | undefined }
    columns: MUIDataTableColumn[]
    defaultSortOrder: MUISortOptions
    tableId: string
    title?: string
    onRowClick?: OnRowClick
    mutateCallback?: (fn: Mutate<any>) => any
    getRowDataCallback?: (fn: GetRowData<any>) => any
    swrOptions?: SWRConfiguration
}
