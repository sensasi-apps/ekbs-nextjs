// types
import type { MUIDataTableState } from 'mui-datatables'
import type { DatatableProps } from '../@types'
// vendors
import { useEffect, useState } from 'react'
// hooks
import { useSwr } from './useSwr'
// functions
import downloadXlsx from '../functions/downloadXlsx'
import formatToDatatableParams from '../utils/formatToDatatableParams'
import dayjs from 'dayjs'

export function useHooks(
    tableId: DatatableProps['tableId'],
    columnDefs: DatatableProps['columns'],
    defaultSortOrder: DatatableProps['defaultSortOrder'],
    apiUrl: DatatableProps['apiUrl'],
    apiUrlParams: DatatableProps['apiUrlParams'],
    swrOptions: DatatableProps['swrOptions'],
) {
    const [columns, setColumns] =
        useState<DatatableProps['columns']>(columnDefs)
    const [sortOrder, setSortOrder] =
        useState<DatatableProps['defaultSortOrder']>(defaultSortOrder)
    const [MuiDatatableState, setMuiDatatableState] =
        useState<MUIDataTableState>()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [datatableSentRequestParamsJson, setDatatableSentRequestParamJson] =
        useState<string>()

    const [
        isDownloadConfirmationDialogOpen,
        setIsDownloadConfirmationDialogOpen,
    ] = useState<boolean>(false)

    const swr = useSwr(
        apiUrl,
        apiUrlParams,
        swrOptions,
        datatableSentRequestParamsJson,
    )
    const { isLoading: swrIsLoading, isValidating } = swr

    useEffect(() => {
        setIsLoading(swrIsLoading || isValidating)
    }, [swrIsLoading, isValidating])

    let timerId: NodeJS.Timeout

    return {
        state: {
            columns,
            sortOrder,
            MuiDatatableState,
            isDownloadConfirmationDialogOpen,
            isLoading,
        },
        swr,
        handleColumnSortChange: (
            changedColumn: string,
            direction: 'asc' | 'desc',
        ) => {
            setSortOrder({
                name: changedColumn,
                direction,
            })
        },
        handleViewColumnsChange: (changedColumn: string, action: string) => {
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
        handleOnDownload: () => {
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
                setIsDownloadConfirmationDialogOpen(true)
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
        handleTableChange: (action: string, tableState: MUIDataTableState) => {
            if (
                JSON.stringify(MuiDatatableState) !== JSON.stringify(tableState)
            ) {
                clearTimeout(timerId)
                timerId = setTimeout(() => {
                    setMuiDatatableState(tableState)

                    const newRequestParamsJson = JSON.stringify(
                        formatToDatatableParams(tableState),
                    )
                    if (
                        datatableSentRequestParamsJson !== newRequestParamsJson
                    ) {
                        setDatatableSentRequestParamJson(newRequestParamsJson)
                    }
                }, 350)
            }
        },
    }
}

function estimateDownloadSizeInB(sampleData: object, count: number) {
    return JSON.stringify(sampleData).length * 4 * count
}
