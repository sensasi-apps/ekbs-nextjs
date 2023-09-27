import type {
    MUIDataTableColumn,
    MUIDataTableOptions,
    MUIDataTableState,
    MUISortOptions,
} from 'mui-datatables'
import type { KeyedMutator } from 'swr'

import { FC, useState } from 'react'
import useSWR from 'swr'
import MUIDataTable, { debounceSearchRender } from 'mui-datatables'

import LinearProgress from '@mui/material/LinearProgress'

import { ACTIONS_ALLOW_FETCH, formatToDatatableParams } from '@/lib/datatable'

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
        onRowClick: onRowClick,
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
        textLabels: {
            body: {
                noMatch:
                    isApiLoading || isValidating
                        ? 'Memuat data...'
                        : 'Tidak ada data yang tersedia',
                toolTip: 'Sort',
            },
        },
    }

    return (
        <div>
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
        </div>
    )
}

export default Datatable
export { getDataRow, mutatorForExport as mutate }
