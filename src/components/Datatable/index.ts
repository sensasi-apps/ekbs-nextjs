export type { DatatableProps } from './@types/DatatableProps'
export type { GetRowData as GetRowDataType } from './@types/GetRowData'
export type { Mutate as MutateType } from './@types/Mutate'
export type { OnRowClick as OnRowClickType } from './@types/OnRowClick'

import { Datatable, getRowData, mutate } from './Datatable'
import { getNoWrapCellProps } from './utils/getNoWrapCellProps'

export { getRowData, getNoWrapCellProps, mutate }
export default Datatable
