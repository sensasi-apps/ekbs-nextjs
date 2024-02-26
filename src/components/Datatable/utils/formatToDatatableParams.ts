import type { MUIDataTableState } from 'mui-datatables'

export default function formatToDatatableParams(tableState: MUIDataTableState) {
    const orderIndex = tableState.columns.findIndex(
        column => column.name === tableState.sortOrder.name,
    )

    const params = {
        draw: tableState.page + 1,
        columns: tableState.columns,
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
