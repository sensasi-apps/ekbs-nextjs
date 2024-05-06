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
import dynamic from 'next/dynamic'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
import ReportIcon from '@mui/icons-material/Report'
// locals
import CustomHeadButton from './components/CustomHeadButton'
// utils
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

const SXs = {
    loading: {
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
        translate: '0 4px',
        zIndex: 1,
    },

    tableParent: {
        '& td, & th': {
            p: 1,
        },
        '& tbody .MuiTableRow-hover': {
            cursor: 'pointer',
        },
    },

    paper: {
        p: 1,
        color: 'error.main',
        fontFamily: 'monospace',
        fontSize: 12,
        maxWidth: '400px',
    },
}

const Datatable = memo(function Datatable({
    apiUrl,
    apiUrlParams,
    columns: defaultColumns,
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
    const [columns, setColums] = useState(defaultColumns)
    const [sortOrder, setSortOrder] = useState(defaultSortOrder)
    const [initialLoading, setInitialLoading] = useState(false)

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

    const isLoading = isApiLoading || isValidating || initialLoading

    let timerId: NodeJS.Timeout

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

            if (!initialLoading) {
                setInitialLoading(true)
            }

            clearTimeout(timerId)
            timerId = setTimeout(() => {
                setParams(formatToDatatableParams(tableState))
                setInitialLoading(false)
            }, 350)
        },
        [],
    )

    const isRowClickable = Boolean(onRowClick)

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
                disabled={isLoading}
                onClick={() => mutate()}>
                <RefreshIcon />
            </CustomHeadButton>
        ),
        rowHover: isRowClickable,
        onRowClick: onRowClick as MUIDataTableOptions['onRowClick'],
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
        onViewColumnsChange(changedColumn, action) {
            if (action === 'add') {
                setColums(prev => {
                    const col = prev.find(col => col.name === changedColumn)

                    if (col && col.options) {
                        col.options.display = true
                    }

                    return prev
                })
            } else {
                setColums(prev => {
                    const col = prev.find(col => col.name === changedColumn)

                    if (col && col.options) {
                        col.options.display = false
                    }

                    return prev
                })
            }
        },
        textLabels: {
            body: {
                noMatch: generateTextLabel(isLoading, error),
                toolTip: 'Urutkan',
            },
        },
        ...props,
    }

    return (
        <Box sx={SXs.tableParent}>
            <Fade in={isLoading}>
                <LinearProgress sx={SXs.loading} />
            </Fade>

            <MUIDataTable
                title={title}
                data={data}
                columns={columns}
                options={options}
            />

            <Typography
                variant="caption"
                display={isRowClickable ? 'block' : 'none'}
                mt={1.1}
                ml={0.5}
                component="div"
                color="gray"
                fontStyle="italic">
                *Klik 2x pada baris untuk membuka formulir.
            </Typography>
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
                <Paper sx={SXs.paper} component="div">
                    {error}
                </Paper>
            </Box>
        )

    return 'Tidak ada data yang tersedia'
}

export function getNoWrapCellProps() {
    return {
        style: { whiteSpace: 'nowrap' },
    }
}
