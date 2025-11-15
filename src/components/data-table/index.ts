export type { DataTableProps } from './types/data-table-props'
export type { GetRowData as GetRowDataType } from './types/get-row-data'
export type { Mutate as MutateType } from './types/mutate'
export type { OnRowClick as OnRowClickType } from './types/on-row-click'

import { DataTable, getRowData, mutate } from './data-table'
import getNoWrapCellProps from './utils/get-no-wrap-cell-props'

export { getRowData, getNoWrapCellProps, mutate }
export default DataTable
