// types
import type {
    DataTableOptions,
    DataTableProps,
    DataTableState,
} from 'mui-datatable-delight'
import type { DatatableProps } from '../@types'
// vendors
import { useRef, useState } from 'react'
import dayjs from 'dayjs'
// hooks
import { useSwr } from './useSwr'
// functions
import downloadXlsx from '../functions/downloadXlsx'
import formatToDatatableParams from '../utils/formatToDatatableParams'
import staticOptions from '../staticOptions'

export function useHooks<T>(
    tableId: DatatableProps<T>['tableId'],
    columnDefs: DatatableProps<T>['columns'],
    defaultSortOrder: DatatableProps<T>['defaultSortOrder'],
    apiUrl: DatatableProps<T>['apiUrl'],
    apiUrlParams: DatatableProps<T>['apiUrlParams'],
    swrOptions: DatatableProps<T>['swrOptions'],
) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(10)
    const [columns, setColumns] =
        useState<DatatableProps<T>['columns']>(columnDefs)
    const [sortOrder, setSortOrder] =
        useState<DatatableProps<T>['defaultSortOrder']>(defaultSortOrder)
    const [MuiDatatableState, setMuiDatatableState] =
        useState<DataTableState<T>>()

    const [datatableSentRequestParamsJson, setDatatableSentRequestParamJson] =
        useState<string>()

    const timerId = useRef<NodeJS.Timeout>(undefined)

    /**
     * not implemented yet
     */
    // const [
    //     isDownloadConfirmationDialogOpen,
    //     setIsDownloadConfirmationDialogOpen,
    // ] = useState<boolean>(false)

    const {
        data: { data = [], recordsFiltered, recordsTotal } = {},
        isLoading,
        isValidating,
        mutate,
    } = useSwr<T>(
        apiUrl,
        apiUrlParams,
        swrOptions,
        datatableSentRequestParamsJson,
    )

    const handleTableChangeOrInit:
        | DataTableOptions<T>['onTableChange']
        | DataTableOptions<T>['onTableInit'] = (_, tableState) => {
        const newRequestParamsJson = JSON.stringify(
            formatToDatatableParams(tableState),
        )

        if (datatableSentRequestParamsJson !== newRequestParamsJson) {
            clearTimeout(timerId.current)

            timerId.current = setTimeout(() => {
                setMuiDatatableState(() => {
                    setDatatableSentRequestParamJson(newRequestParamsJson)

                    return tableState
                })
            }, 500)
        }
    }

    const options: DataTableProps<T>['options'] = {
        ...staticOptions,
        rowsPerPage,
        sortOrder: sortOrder,
        onTableChange: handleTableChangeOrInit,
        onTableInit: handleTableChangeOrInit,
        onColumnSortChange(changedColumn, direction) {
            setSortOrder({
                name: changedColumn,
                direction,
            })
        },
        onChangeRowsPerPage: setRowsPerPage,
        onViewColumnsChange: (changedColumn: string, action: string) => {
            if (action === 'add') {
                setColumns(prev => {
                    const col = prev.find(col => col.name === changedColumn)

                    if (col && col.options) {
                        col.options.display = true
                    }

                    return prev
                })
            } else {
                setColumns(prev => {
                    const col = prev.find(col => col.name === changedColumn)

                    if (col && col.options) {
                        col.options.display = false
                    }

                    return prev
                })
            }
        },
        onDownload: () => {
            if (!MuiDatatableState) {
                return false
            }

            const sampleData = MuiDatatableState.data[0] ?? undefined
            const nData = MuiDatatableState.count
            const estimatedB = estimateDownloadSizeInB(sampleData, nData)

            if (
                estimatedB >
                100 * 1024 * 1024 // 100 MB
            ) {
                /**
                 * PENDING: Uncomment this line when the DownloadConfirmationDialog component is ready
                 */
                // setIsDownloadConfirmationDialogOpen(true)
            } else if (estimatedB) {
                downloadXlsx(
                    apiUrl,
                    apiUrlParams,
                    MuiDatatableState,
                    'datatable-' +
                        tableId +
                        '-' +
                        dayjs().format('YYYY-MM-DD-HH-mm-ss') +
                        '.xlsx',
                )
            }

            return false
        },
        count: recordsFiltered ?? recordsTotal ?? 0,
    }

    return {
        data,
        mutate,
        columns,
        isLoading: isLoading || isValidating,
        options,

        /**
         * not implemented yet
         */
        // isDownloadConfirmationDialogOpen,
    }
}

function estimateDownloadSizeInB(sampleData: object, count: number) {
    return JSON.stringify(sampleData).length * 4 * count
}
