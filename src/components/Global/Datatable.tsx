import type {
    MUIDataTableColumn,
    MUIDataTableOptions,
    MUIDataTableState,
    MUISortOptions,
} from 'mui-datatables'
import type { KeyedMutator } from 'swr'
import type { IconButtonProps } from '@mui/material/IconButton'

import { FC, useState } from 'react'
import useSWR from 'swr'
import { debounceSearchRender } from 'mui-datatables'

import dynamic from 'next/dynamic'

const MUIDataTable = dynamic(() => import('mui-datatables'), {
    ssr: false,
})

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

import RefreshIcon from '@mui/icons-material/Refresh'

let getDataRow: <T = object>(index: number) => T
let mutatorForExport: KeyedMutator<any>

const Datatable: FC<{
    apiUrl: string
    columns: MUIDataTableColumn[]
    defaultSortOrder: MUISortOptions
    tableId: string
    title?: string
    onRowClick?: (
        rowData: string[],
        rowMeta: {
            dataIndex: number
            rowIndex: number
        },
        event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    ) => void
}> = ({ title, tableId, apiUrl, columns, onRowClick, defaultSortOrder }) => {
    const [params, setParams] = useState<any>()
    const [sortOrder, setSortOrder] = useState<MUISortOptions>(defaultSortOrder)

    const {
        isLoading: isApiLoading,
        isValidating,
        data: { data = [], recordsTotal } = {},
        mutate,
    } = useSWR(params ? [apiUrl, params] : null)

    getDataRow = index => data[index]
    mutatorForExport = mutate

    const handleFetchData = async (
        action: string,
        tableState: MUIDataTableState,
    ) => {
        if (!ACTIONS_ALLOW_FETCH.includes(action)) {
            return false
        }

        if (action === 'sort') {
            setSortOrder(prev => {
                prev.name = tableState.sortOrder.name
                prev.direction = tableState.sortOrder.direction

                return prev
            })
        }

        setParams(formatToDatatableParams(tableState, columns))
    }

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
        onRowClick: onRowClick as any,
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
        textLabels: {
            body: {
                noMatch:
                    isApiLoading || isValidating
                        ? 'Memuat data...'
                        : 'Tidak ada data yang tersedia',
                toolTip: 'Urutkan',
            },
        },
    }

    return (
        <Box
            sx={{
                '& tbody tr:hover': {
                    cursor: 'pointer',
                    ripple: {
                        color: 'transparent',
                    },
                },
            }}>
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
        </Box>
    )
}

export default Datatable
export { getDataRow, mutatorForExport as mutate }

const ACTIONS_ALLOW_FETCH = [
    'sort',
    'changePage',
    'changeRowsPerPage',
    'search',
    'tableInitialized',
]

const formatToDatatableParams = (
    tableState: MUIDataTableState,
    columns: MUIDataTableColumn[],
) => {
    const orderIndex = columns.findIndex(
        column => column.name === tableState.sortOrder.name,
    )

    columns.forEach(column => {
        // @ts-ignore
        column.searchable = column?.options?.searchable
    })

    const params = {
        draw: tableState.page + 1,
        columns: columns,
        order: [
            {
                column: orderIndex,
                dir: tableState.sortOrder.direction || 'desc',
            },
        ],
        start: tableState.page * tableState.rowsPerPage,
        length: tableState.rowsPerPage,
        search: {
            value: tableState.searchText,
            regex: false,
        },
    }

    return params
}

function CustomHeadButton(props: IconButtonProps) {
    return (
        <Tooltip arrow title={props['aria-label']}>
            <IconButton {...props} />
        </Tooltip>
    )
}
