// types
import type {
    MUIDataTableColumn,
    MUIDataTableOptions,
    MUIDataTableState,
    MUISortOptions,
} from 'mui-datatables'
import type { KeyedMutator } from 'swr'
import type { OnRowClickType } from './types'
// vendors
import { memo, useCallback, useState } from 'react'
import useSWR from 'swr'
import { debounceSearchRender } from 'mui-datatables'
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
import formatToDatatableParams from './utils/formatToDatatableParams'
import YajraDatatable from '@/types/responses/YajraDatatable'

const MUIDataTable = dynamic(() => import('mui-datatables'), {
    ssr: false,
})

/**
 * @todo
 * - [ ] Don't make this global, it will cause bugs when datatable instance is more than one
 */

let getRowData: <T = object>(index: number) => T | undefined
let mutatorForExport: MutateType

const Datatable = memo(function Datatable({
    apiUrl,
    columns,
    defaultSortOrder,
    tableId,
    title,
    onRowClick,
    mutateCallback,
    getRowDataCallback,
}: {
    apiUrl: string
    columns: MUIDataTableColumn[]
    defaultSortOrder: MUISortOptions
    tableId: string
    title?: string
    onRowClick?: OnRowClickType
    mutateCallback?: (fn: MutateType<any>) => any
    getRowDataCallback?: (fn: GetRowDataType<any>) => any
}) {
    const [params, setParams] = useState<any>()
    const [sortOrder, setSortOrder] = useState(defaultSortOrder)

    const {
        isLoading: isApiLoading,
        isValidating,
        data: { data = [], recordsTotal, error } = {},
        mutate,
    } = useSWR<YajraDatatable<object>>(params ? [apiUrl, params] : null, {
        keepPreviousData: true,
    })

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

            setParams(formatToDatatableParams({ ...tableState }, columns))
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
        count: recordsTotal || 0,
        customSearchRender: debounceSearchRender(750),
        customToolbar: () => (
            <CustomHeadButton
                aria-label="Refresh"
                disabled={isApiLoading || isValidating}
                onClick={() => mutate()}>
                <RefreshIcon />
            </CustomHeadButton>
        ),
        rowHover: isRowClickable,
        onRowClick: onRowClick as MUIDataTableOptions['onRowClick'],
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
        textLabels: {
            body: {
                noMatch: generateTextLabel(isApiLoading || isValidating, error),
                toolTip: 'Urutkan',
            },
        },
    }

    return (
        <Box
            sx={
                isRowClickable
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
                data={data || []}
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
