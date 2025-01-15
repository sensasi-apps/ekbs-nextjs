import type { DataTableOptions } from 'mui-datatable-delight'

const STATIC_TEXT_LABELS = {
    pagination: {
        next: 'selanjutnya',
        previous: 'sebelumnya',
        rowsPerPage: 'data/halaman:',
        jumpToPage: 'halaman:',
    },
    toolbar: {
        search: 'Cari',
        downloadCsv: 'Unduh',
        print: 'Cetak',
        viewColumns: 'Tampilkan kolom',
    },
    body: {
        noMatch: 'Tidak ada data yang tersedia',
        toolTip: 'Urutkan',
    },
}

const staticOptions: DataTableOptions = {
    filter: false,
    serverSide: true,
    responsive: 'standard',
    selectableRows: 'none',
    print: false,
    jumpToPage: true,
    textLabels: STATIC_TEXT_LABELS,
}

export default staticOptions
