const ACTIONS_ALLOW_FETCH = [
    'sort',
    'changePage',
    'changeRowsPerPage',
    'search',
    'tableInitialized',
]

const formatToDatatableParams = (tableState, columns) => {
    const orderIndex = columns.findIndex(
        column => column.name === tableState.sortOrder.name,
    )
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

export { formatToDatatableParams, ACTIONS_ALLOW_FETCH }
