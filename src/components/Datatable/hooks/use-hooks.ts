// types
import type { DataTableProps, DataTableState } from 'mui-datatable-delight'
import type { DatatableProps } from '../@types'
// vendors
import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type KeyboardEvent,
    type RefObject,
    type SetStateAction,
} from 'react'
import dayjs from 'dayjs'
// hooks
import useSwr from './use-swr'
// functions
import downloadXlsx from '../functions/downloadXlsx'
import formatToDatatableParams from '../utils/formatToDatatableParams'
import staticOptions from '../staticOptions'
import { enqueueSnackbar } from 'notistack'

export default function useHooks<T>(
    tableId: DatatableProps<T>['tableId'],
    columnDefs: DatatableProps<T>['columns'],
    defaultSortOrder: DatatableProps<T>['defaultSortOrder'],
    apiUrl: DatatableProps<T>['apiUrl'],
    apiUrlParams: DatatableProps<T>['apiUrlParams'],
    swrOptions: DatatableProps<T>['swrOptions'],
) {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)
    const [rowsPerPage, setRowsPerPage] = useState<number>(10)
    const [columns, setColumns] =
        useState<DatatableProps<T>['columns']>(columnDefs)
    const [sortOrder, setSortOrder] =
        useState<DatatableProps<T>['defaultSortOrder']>(defaultSortOrder)

    const [datatableSentRequestParamsJson, setDatatableSentRequestParamJson] =
        useState<string>()

    const lastDataTableState = useRef<DataTableState<T> | undefined>(undefined)

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
        isLoading,
        isValidating,
        mutate,
    } = useSwr<T>(
        apiUrl,
        apiUrlParams,
        swrOptions,
        datatableSentRequestParamsJson,
    )

    const options: DataTableProps<T>['options'] = {
        ...staticOptions,
        rowsPerPage,
        sortOrder: sortOrder,
        searchProps: {
            onKeyUp: (ev: KeyboardEvent<HTMLInputElement>) => {
                if (ev.key === 'Enter' && 'value' in ev.target) {
                    handleSearchChange(
                        ev.target.value as string,
                        lastDataTableState,
                        setDatatableSentRequestParamJson,
                    )
                }
            },
            onBlur: ev => {
                handleSearchChange(
                    ev.currentTarget.value,
                    lastDataTableState,
                    setDatatableSentRequestParamJson,
                )
            },
        },
        onTableChange: (action, tableState) => {
            const newRequestParamsJson = JSON.stringify(
                formatToDatatableParams(tableState),
            )

            if (
                action !== 'search' &&
                datatableSentRequestParamsJson !== newRequestParamsJson
            ) {
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
            const estimatedB = estimateDownloadSizeInKB(sampleData, nData)

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
                setIsDownloading(true)

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
                    setIsDownloading(false)
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
        isLoading: isLoading || isValidating || isDownloading,
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
function estimateDownloadSizeInKB<T>(sampleData: T, count: number) {
    return (JSON.stringify(sampleData).length * 4 * count) / 1024
}

function handleSearchChange<T>(
    value: string,
    lastDataTableState: RefObject<DataTableState<T> | undefined>,
    setDatatableSentRequestParamJson: Dispatch<
        SetStateAction<string | undefined>
    >,
) {
    setDatatableSentRequestParamJson(prev => {
        const params = JSON.parse(prev ?? '{}')

        if (value === params.search.value) {
            return prev
        }

        if (!lastDataTableState?.current) {
            throw new Error('Datatable state is not initialized')
        }

        const newState: DataTableState<T> = {
            ...lastDataTableState.current,
            page: 0,
            searchText: value,
        }

        lastDataTableState.current = newState

        return JSON.stringify(formatToDatatableParams(newState))
    })
}
