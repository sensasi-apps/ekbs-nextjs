// types
import type { MUIDataTableOptions, MUIDataTableState } from 'mui-datatables'
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
    const [MuiDatatableState, setMuiDatatableState] =
        useState<MUIDataTableState>()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [datatableSentRequestParamsJson, setDatatableSentRequestParamJson] =
        useState<string>()

    // PENDING: Uncomment this line when the DownloadConfirmationDialog component is ready
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
        | MUIDataTableOptions['onTableChange']
        | MUIDataTableOptions['onTableInit'] = (
        action: string,
        tableState: MUIDataTableState,
    ) => {
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

    const options: MUIDataTableOptions = {
        ...staticOptions,
        rowsPerPage,
        sortOrder: sortOrder,
        onTableChange: handleTableChangeOrInit,
        onTableInit: handleTableChangeOrInit,
        onColumnSortChange: (
            changedColumn: string,
            direction: 'asc' | 'desc',
        ) => {
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
        textLabels: {
            ...STATIC_TEXT_LABLES,
            body: {
                noMatch: isLoading
                    ? 'Memuat data...'
                    : 'Tidak ada data yang tersedia',
                toolTip: 'Urutkan',
            },
        },
        count: recordsFiltered ?? recordsTotal ?? 0,
    }

    return {
        data,
        mutate,
        columns,
        isLoading,
        // isDownloadConfirmationDialogOpen,
        options,
    }
}

function estimateDownloadSizeInB(sampleData: object, count: number) {
    return JSON.stringify(sampleData).length * 4 * count
}

const STATIC_TEXT_LABLES = {
    pagination: {
        next: 'Selanjutnya',
        previous: 'Sebelumnya',
        rowsPerPage: 'Baris per halaman:',
        jumpToPage: 'Pergi ke halaman:',
    },
    toolbar: {
        search: 'Cari',
        downloadCsv: 'Unduh',
        print: 'Cetak',
        viewColumns: 'Tampilkan kolom',
    },
}
