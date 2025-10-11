import type { DataTableState } from 'mui-datatable-delight'

/**
 * @param tableState
 * @returns datatable params
 *
 * @see https://datatables.net/manual/server-side
 */
export default function formatToDatatableParams<T>(
    tableState: DataTableState<T>,
): DataTableRequest {
    const orderIndex = tableState.columns.findIndex(
        column => column.name === tableState.sortOrder?.name,
    )

    return {
        columns: formatColumns(tableState.columns),
        draw: tableState.page + 1,
        length: tableState.rowsPerPage,
        order: [
            {
                column: orderIndex,
                dir: tableState.sortOrder?.direction ?? 'desc',
            },
        ],
        search: {
            regex: false,
            value: tableState.searchText,
        },
        start: tableState.page * tableState.rowsPerPage,
    }
}

function formatColumns<T>(
    columns: DataTableState<T>['columns'],
): DataTableRequest['columns'] {
    return columns.map(({ name, searchable, sort }) => ({
        data: name,
        name: name,
        orderable: sort ?? true,
        searchable: searchable ?? true,
    }))
}

/**
 * @see https://datatables.net/manual/server-side#Sent-parameters
 */
interface DataTableRequest {
    draw: number
    start: number
    length: number
    search: {
        value: string | null
        regex: boolean
    }
    order: {
        column: number
        dir: string
    }[]
    columns: {
        data: string
        name: string
        searchable: boolean
        orderable: boolean
        search?: {
            value: string
            regex: boolean
        }
    }[]
}
