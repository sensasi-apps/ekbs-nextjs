import type { MUIDataTableColumn } from 'mui-datatables'

export const DATATABE_SEARCH_ONLY_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'productSale.buyerUser.name',
        options: {
            display: 'excluded',
            download: false,
            filter: false,
            sort: false,
        },
    },
    {
        name: 'userLoan.user.name',
        options: {
            display: 'excluded',
            download: false,
            filter: false,
            sort: false,
        },
    },
    {
        name: 'rentItemRent.byUser.name',
        options: {
            display: 'excluded',
            download: false,
            filter: false,
            sort: false,
        },
    },
    {
        name: 'productSale.buyerUser.id',
        options: {
            display: 'excluded',
            download: false,
            filter: false,
            sort: false,
        },
    },
    {
        name: 'userLoan.user.id',
        options: {
            display: 'excluded',
            download: false,
            filter: false,
            sort: false,
        },
    },
    {
        name: 'rentItemRent.byUser.id',
        options: {
            display: 'excluded',
            download: false,
            filter: false,
            sort: false,
        },
    },
]
