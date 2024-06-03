export type { OnRowClick as OnRowClickType } from './@types/OnRowClick'
export type { GetRowData as GetRowDataType } from './@types/GetRowData'
export type { Mutate as MutateType } from './@types/Mutate'

import { getNoWrapCellProps } from './utils/getNoWrapCellProps'
import { Datatable, getRowData, mutate } from './Datatable'

export { getRowData, getNoWrapCellProps, mutate }
export default Datatable
