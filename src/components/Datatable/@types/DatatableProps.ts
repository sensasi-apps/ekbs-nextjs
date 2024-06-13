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
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutateCallback?: (fn: Mutate<any>) => unknown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowDataCallback?: (fn: GetRowData<any>) => unknown
    swrOptions?: SWRConfiguration
}
