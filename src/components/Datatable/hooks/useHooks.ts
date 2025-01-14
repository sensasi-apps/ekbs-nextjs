// types
import type { DataTableOptions, DataTableState } from 'mui-datatable-delight'
import type { DatatableProps } from '../@types'
// vendors
import { useEffect, useState } from 'react'
// hooks
import { useSwr } from './useSwr'
// functions
import downloadXlsx from '../functions/downloadXlsx'
import formatToDatatableParams from '../utils/formatToDatatableParams'
import dayjs from 'dayjs'
import staticOptions from '../staticOptions'

export function useHooks<T>(
    tableId: DatatableProps['tableId'],
    columnDefs: DatatableProps['columns'],
    defaultSortOrder: DatatableProps['defaultSortOrder'],
    apiUrl: DatatableProps['apiUrl'],
    apiUrlParams: DatatableProps['apiUrlParams'],
    swrOptions: DatatableProps['swrOptions'],
) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(
        staticOptions.rowsPerPageOptions?.[0] ?? 10,
    )
    const [columns, setColumns] =
        useState<DatatableProps['columns']>(columnDefs)
    const [sortOrder, setSortOrder] =
        useState<DatatableProps['defaultSortOrder']>(defaultSortOrder)
    const [MuiDatatableState, setMuiDatatableState] = useState<DataTableState>()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [datatableSentRequestParamsJson, setDatatableSentRequestParamJson] =
        useState<string>()

    /**
     * @deprecated not implemented yet
     */
    // const [
    //     isDownloadConfirmationDialogOpen,
    //     setIsDownloadConfirmationDialogOpen,
    // ] = useState<boolean>(false)

    const {
        data: { data = [], recordsTotal, recordsFiltered } = {},
        mutate,
        isLoading: swrIsLoading,
        isValidating,
    } = useSwr<T>(
        apiUrl,
        apiUrlParams,
        swrOptions,
        datatableSentRequestParamsJson,
    )

    useEffect(() => {
        setIsLoading(swrIsLoading || isValidating)
    }, [swrIsLoading, isValidating])

    let timerId: NodeJS.Timeout

    const handleTableChangeOrInit:
        | DataTableOptions['onTableChange']
        | DataTableOptions['onTableInit'] = (_, tableState) => {
        if (JSON.stringify(MuiDatatableState) !== JSON.stringify(tableState)) {
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                setMuiDatatableState(tableState)

                const newRequestParamsJson = JSON.stringify(
                    formatToDatatableParams(tableState),
                )
                if (datatableSentRequestParamsJson !== newRequestParamsJson) {
                    setDatatableSentRequestParamJson(newRequestParamsJson)
                }
            }, 350)
        }
    }

    const options: DataTableOptions = {
        ...staticOptions,
        rowsPerPage,
        sortOrder: sortOrder,
        onTableChange: handleTableChangeOrInit,
        onTableInit: handleTableChangeOrInit,
        onColumnSortChange: (changedColumn, direction) => {
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

            setIsLoading(true)

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
                ).then(() => setIsLoading(false))
            }

            return false
        },
        count: recordsFiltered ?? recordsTotal ?? 0,
    }

    return {
        data,
        mutate,
        columns,
        isLoading,

        /**
         * @deprecated not implemented yet
         */
        // isDownloadConfirmationDialogOpen,
        options,
    }
}

function estimateDownloadSizeInB(sampleData: object, count: number) {
    return JSON.stringify(sampleData).length * 4 * count
}
