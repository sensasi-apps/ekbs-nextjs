import { debounceSearchRender, type MUIDataTableOptions } from 'mui-datatables'

const staticOptions: MUIDataTableOptions = {
    filter: false,
    serverSide: true,
    responsive: 'standard',
    selectableRows: 'none',
    print: false,
    jumpToPage: true,
    rowsPerPageOptions: [10, 25, 50, 100, 0],
    customSearchRender: debounceSearchRender(100),
}

export default staticOptions
