import type { DataTableRequest } from '@/@types/request/datatable'
import type { DataTableState } from 'mui-datatable-delight'
import type { MUIDataTableColumnState } from 'mui-datatables'

/**
 *
 * @param tableState
 * @returns datatable params
 *
 * @see https://datatables.net/manual/server-side
 */
export default function formatToDatatableParams(
    tableState: DataTableState,
): DataTableRequest {
    const orderIndex = tableState.columns.findIndex(
        column => column.name === tableState.sortOrder?.name,
    )

    return {
        draw: tableState.page + 1,
        start: tableState.page * tableState.rowsPerPage,
        length: tableState.rowsPerPage,
        search: {
            value: tableState.searchText,
            regex: false,
        },
        order: [
            {
                column: orderIndex,
                dir: tableState.sortOrder?.direction || 'desc',
            },
        ],
        columns: formatColumns(tableState.columns as MUIDataTableColumnState[]),
    }
}

function formatColumns(
    columns: MUIDataTableColumnState[],
): DataTableRequest['columns'] {
    return columns.map(({ name, searchable, sort }) => ({
        data: name,
        name: name,
        searchable: searchable ?? true,
        orderable: sort ?? true,
    }))
}
