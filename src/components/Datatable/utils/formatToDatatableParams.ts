import type { MUIDataTableColumn, MUIDataTableState } from 'mui-datatables'

export default function formatToDatatableParams(
    tableState: MUIDataTableState,
    columns: MUIDataTableColumn[],
) {
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
