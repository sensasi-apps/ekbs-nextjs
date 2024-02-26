// types
import type YajraDatatable from '@/types/responses/YajraDatatable'
import type {
    MUIDataTableColumn,
    MUIDataTableOptions,
    MUIDataTableState,
    MUISortOptions,
} from 'mui-datatables'
import type { KeyedMutator } from 'swr'
import type { OnRowClickType } from './types'
import type { SWRConfiguration } from 'swr'
// vendors
import { memo, useCallback, useState } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
import ReportIcon from '@mui/icons-material/Report'
// locals
import CustomHeadButton from './components/CustomHeadButton'
// utils
import debounce from '@/utils/debounce'
import formatToDatatableParams from './utils/formatToDatatableParams'

const MUIDataTable = dynamic(() => import('mui-datatables'), {
    ssr: false,
})

/**
 * @todo
 * - [ ] Don't make this global, it will cause bugs when datatable instance is more than one
 * - [ ] table state always restart when data changed
 */

let getRowData: <T = object>(index: number) => T | undefined
let mutatorForExport: MutateType

export type DatatableProps = {
    apiUrl: string
    apiUrlParams?: { [key: string]: string | number | undefined }
    columns: MUIDataTableColumn[]
    defaultSortOrder: MUISortOptions
    tableId: string
    title?: string
    onRowClick?: OnRowClickType
    mutateCallback?: (fn: MutateType<any>) => any
    getRowDataCallback?: (fn: GetRowDataType<any>) => any
    swrOptions?: SWRConfiguration
}

const Datatable = memo(function Datatable({
    apiUrl,
    apiUrlParams,
    columns,
    defaultSortOrder,
    tableId,
    title,
    onRowClick,
    mutateCallback,
    getRowDataCallback,
    swrOptions,
    ...props
}: DatatableProps & Omit<MUIDataTableOptions, 'onRowClick'>) {
    const [params, setParams] = useState<any>()
    const [sortOrder, setSortOrder] = useState(defaultSortOrder)

    const { keepPreviousData = true, ...restSwrOptions } = swrOptions || {}

    const {
        isLoading: isApiLoading,
        isValidating,
        data: { data = [], recordsTotal, recordsFiltered, error } = {},
        mutate,
    } = useSWR<YajraDatatable<object>>(
        params ? [apiUrl, { ...params, ...apiUrlParams }] : null,
        null,
        {
            keepPreviousData: keepPreviousData,
            ...restSwrOptions,
        },
    )

    getRowData = index => data[index] as any
    mutatorForExport = mutate

    if (mutateCallback) {
        mutateCallback(mutate)
    }

    if (getRowDataCallback) {
        getRowDataCallback(index => data[index])
    }

    const handleFetchData = useCallback(
        (action: string, tableState: MUIDataTableState) => {
            if (
                ![
                    'sort',
                    'changePage',
                    'changeRowsPerPage',
                    'search',
                    'tableInitialized',
                ].includes(action)
            ) {
                return false
            }

            if (action === 'sort') {
                setSortOrder(prev => {
                    prev.name = tableState.sortOrder.name
                    prev.direction = tableState.sortOrder.direction

                    return prev
                })
            }

            debounce(() => setParams(formatToDatatableParams(tableState)), 350)
        },
        [],
    )

    const isRowClickable = Boolean(onRowClick)
    const isHover = !isApiLoading && data.length > 0 && isRowClickable

    const options: MUIDataTableOptions = {
        tableId: tableId,
        filter: false,
        sortOrder: sortOrder,
        serverSide: true,
        responsive: 'standard',
        selectableRows: 'none',
        download: false,
        print: false,
        jumpToPage: true,
        count: recordsFiltered ?? recordsTotal ?? 0,
        customToolbar: () => (
            <CustomHeadButton
                aria-label="Refresh"
                disabled={isApiLoading || isValidating}
                onClick={() => mutate()}>
                <RefreshIcon />
            </CustomHeadButton>
        ),
        rowHover: isHover,
        onRowClick: onRowClick as MUIDataTableOptions['onRowClick'],
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
        textLabels: {
            body: {
                noMatch: generateTextLabel(isApiLoading || isValidating, error),
                toolTip: 'Urutkan',
            },
        },
        ...props,
    }

    return (
        <Box
            sx={
                isHover
                    ? {
                          '& tbody tr:hover': {
                              cursor: 'pointer',
                          },
                      }
                    : undefined
            }>
            {(isApiLoading || isValidating) && (
                <LinearProgress
                    sx={{
                        borderTopLeftRadius: 11,
                        borderTopRightRadius: 11,
                        translate: '0 4px',
                        zIndex: 1,
                    }}
                />
            )}

            <MUIDataTable
                title={title}
                data={data}
                columns={columns}
                options={options}
            />

            {isRowClickable && (
                <Typography
                    variant="caption"
                    mt={1.1}
                    ml={0.5}
                    component="div"
                    color="gray"
                    fontStyle="italic">
                    *Klik 2x pada baris untuk membuka formulir.
                </Typography>
            )}
        </Box>
    )
})

export default Datatable
export { getRowData, mutatorForExport as mutate }
export type GetRowDataType<T = unknown> = (index: number) => T | undefined
export type MutateType<T = object> = KeyedMutator<YajraDatatable<T>>

function generateTextLabel(isLoading: boolean, error: YajraDatatable['error']) {
    if (isLoading) {
        return 'Memuat data...'
    }

    if (error)
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center">
                <Typography color="error" component="div">
                    <ReportIcon />
                </Typography>
                <Typography color="error" component="div" mb={1}>
                    Terjadi kesalahan
                </Typography>
                <Paper
                    sx={{
                        p: 1,
                        color: 'error.main',
                        fontFamily: 'monospace',
                        fontSize: 12,
                        maxWidth: '400px',
                    }}
                    component="div">
                    {error}
                </Paper>
            </Box>
        )

    return 'Tidak ada data yang tersedia'
}
