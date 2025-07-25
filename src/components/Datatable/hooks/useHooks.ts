// types
import type { DataTableProps, DataTableState } from 'mui-datatable-delight'
import type { DatatableProps } from '../@types'
// vendors
import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
// hooks
import { useSwr } from './useSwr'
// functions
import downloadXlsx from '../functions/downloadXlsx'
import formatToDatatableParams from '../utils/formatToDatatableParams'
import staticOptions from '../staticOptions'
import { enqueueSnackbar } from 'notistack'

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

    const [datatableSentRequestParamsJson, setDatatableSentRequestParamJson] =
        useState<string>()

    const [isLoading, setIsLoading] = useState(false)

    const lastDataTableState = useRef<DataTableState<T>>()

    useEffect(() => {
        if (!lastDataTableState.current) {
            throw new Error('Datatable state is not initialized')
        }

        const newRequestParamsJson = JSON.stringify(
            formatToDatatableParams(lastDataTableState.current),
        )

        setDatatableSentRequestParamJson(newRequestParamsJson)
    }, [])

    /**
     * not implemented yet
     */
    // const [
    //     isDownloadConfirmationDialogOpen,
    //     setIsDownloadConfirmationDialogOpen,
    // ] = useState<boolean>(false)

    const {
        data: { data = [], recordsFiltered, recordsTotal } = {},
        isLoading: isSwrLoading,
        isValidating,
        mutate,
    } = useSwr<T>(
        apiUrl,
        apiUrlParams,
        swrOptions,
        datatableSentRequestParamsJson,
    )

    useEffect(() => {
        setIsLoading(isSwrLoading || isValidating)
    }, [isSwrLoading, isValidating])

    const options: DataTableProps<T>['options'] = {
        ...staticOptions,
        rowsPerPage,
        sortOrder: sortOrder,
        onTableChange: (_, tableState) => {
            const newRequestParamsJson = JSON.stringify(
                formatToDatatableParams(tableState),
            )

            if (datatableSentRequestParamsJson !== newRequestParamsJson) {
                setDatatableSentRequestParamJson(newRequestParamsJson)
                lastDataTableState.current = tableState
            }
        },
        onTableInit: (_, tableState) => {
            lastDataTableState.current = tableState
        },
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
        onDownload: (_, __, ___, data) => {
            if (!lastDataTableState.current) {
                return false
            }

            const sampleData = data[0].data ?? undefined
            const nData = recordsFiltered ?? recordsTotal ?? data.length
            const estimatedB = estimateDownloadSizeInB(sampleData, nData)

            if (
                estimatedB >
                4 * 1024 // 4 MB
            ) {
                enqueueSnackbar(
                    `Tidak dapat melakukan unduh karena ukuran data terlalu besar. mohon lakukan penyaringan.`,
                    {
                        variant: 'warning',
                    },
                )
            } else if (estimatedB) {
                setIsLoading(true)

                downloadXlsx(
                    apiUrl,
                    apiUrlParams,
                    lastDataTableState.current,
                    'datatable-' +
                        tableId +
                        '-' +
                        dayjs().format('YYYY-MM-DD-HH-mm-ss') +
                        '.xlsx',
                ).then(() => {
                    setIsLoading(false)
                })
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
        options,

        /**
         * not implemented yet
         */
        // isDownloadConfirmationDialogOpen,
    }
}

/**
 * Estimate download size in kilobytes
 */
function estimateDownloadSizeInB<T>(sampleData: T, count: number) {
    return (JSON.stringify(sampleData).length * 4 * count) / 1024
}
