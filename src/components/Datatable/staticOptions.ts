import { type MUIDataTableOptions } from 'mui-datatables'

const staticOptions: MUIDataTableOptions = {
    filter: false,
    serverSide: true,
    responsive: 'standard',
    selectableRows: 'none',
    print: false,
    jumpToPage: true,
    rowsPerPageOptions: [15, 30, 50, 100, 0],
}

export default staticOptions
