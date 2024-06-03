import type { MUIDataTableColumnState, MUIDataTableState } from 'mui-datatables'

/**
 *
 * @param tableState
 * @returns datatable params
 *
 * @see https://datatables.net/manual/server-side
 *
 */
export default function formatToDatatableParams(tableState: MUIDataTableState) {
    const orderIndex = tableState.columns.findIndex(
        column => column.name === tableState.sortOrder.name,
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
                dir: tableState.sortOrder.direction || 'desc',
            },
        ],
        columns: formatColumns(tableState.columns),
    }
}

function formatColumns(columns: MUIDataTableColumnState[]) {
    return columns.map(column => ({
        data: column.name,
        name: column.name,
        searchable: column.searchable,
        orderable: column.sort,
        search: {
            value: column.filterList?.[0],
            regex: false,
        },
    }))
}
