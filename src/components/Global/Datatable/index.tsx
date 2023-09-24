import type {
    MUIDataTableColumn,
    MUIDataTableOptions,
    MUIDataTableState,
    MUISortOptions,
} from 'mui-datatables'

import { FC, useState } from 'react'
import useSWR from 'swr'
import MUIDataTable, { debounceSearchRender } from 'mui-datatables'

import LinearProgress from '@mui/material/LinearProgress'

import { ACTIONS_ALLOW_FETCH, formatToDatatableParams } from '@/lib/datatable'

interface DatatableProps {
    apiUrl: string
    columns: MUIDataTableColumn[]
    defaultSortOrder: MUISortOptions
    tableId: string
    title?: string
    onRowClick?: (rowData: any, rowMeta: any) => void
}

let getDataRow: (index: number) => object

// TODO: access mutator
//

const Datatable: FC<DatatableProps> = ({
    title,
    tableId,
    apiUrl,
    columns,
    onRowClick,
    defaultSortOrder,
}) => {
    const [params, setParams] = useState<any>()
    const [sortOrder, setSortOrder] = useState<MUISortOptions>(defaultSortOrder)

    const {
        isLoading: isApiLoading,
        isValidating,
        data: { data = [], recordsTotal } = {},
    } = useSWR(params ? [apiUrl, params] : null)

    getDataRow = (index: number) => data[index]

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
export { getDataRow }
