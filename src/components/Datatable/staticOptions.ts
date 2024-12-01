import { debounceSearchRender, type MUIDataTableOptions } from 'mui-datatables'

const staticOptions: MUIDataTableOptions = {
    filter: false,
    serverSide: true,
    responsive: 'standard',
    selectableRows: 'none',
    print: false,
    jumpToPage: true,
    rowsPerPage: 15,
    rowsPerPageOptions: [15, 30, 50, 100, 0],
    customSearchRender: debounceSearchRender(1000),
}

export default staticOptions
