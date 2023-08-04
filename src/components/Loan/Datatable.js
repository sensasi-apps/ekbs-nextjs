import axios from '@/lib/axios'
import { useState } from 'react'
import MUIDataTable, { debounceSearchRender } from 'mui-datatables'
import QueryString from 'qs'
import moment from 'moment'
import numberFormat from '@/lib/numberFormat'
import LoadingCenter from '../Statuses/LoadingCenter'
import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import Loan from '@/classes/loan'

const LoanDatatable = ({ mode, onRowClick }) => {
    const [data, setData] = useState([])
    const [totalData, setTotalData] = useState(0)
    const [sortOrder, setSortOrder] = useState({
        name: 'proposed_at',
        direction: 'desc',
    })
    const [isLoading, setIsLoading] = useState(false)

    const columns = [
        {
            name: 'uuid',
            label: 'uuid',
            options: {
                display: false,
            },
        },
        {
            name: 'proposed_at',
            label: 'Tanggal Pengajuan',
            options: {
                customBodyRender: value => moment(value).format('DD MMMM YYYY'),
            },
        },
        {
            name: 'user.name',
            label: 'Nama',
            options: {
                customBodyRender: (value, tableMeta) =>
                    data[tableMeta.rowIndex]['user']['name'],
            },
        },
        {
            name: 'proposed_rp',
            label: 'Jumlah Pengajuan',
            options: {
                customBodyRender: value => numberFormat(value),
            },
        },
        {
            name: 'type',
            label: 'Jenis',
        },

        {
            name: 'purpose',
            label: 'Keperluan',
        },
        {
            name: 'status',
            label: 'Status',
            searchable: false,
            orderable: false,
            options: {
                sort: false,
                customBodyRender: value => (
                    <Typography
                        variant="body2"
                        color={Loan.colorByStatus(value)}
                        component="span">
                        {value}
                    </Typography>
                ),
            },
        },
    ]

    const fetchData = async (action, tableState) => {
        setIsLoading(true)

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

        const response = await axios.get(
            mode === 'manager' ? '/user-loans/datatable' : '/loans/datatable',
            {
                params: params,
                paramsSerializer: params => QueryString.stringify(params),
            },
        )

        setTotalData(response.data.recordsFiltered)
        setData(response.data.data)
        setIsLoading(false)

        return response.data
    }

    const options = {
        tableId: 'user-loans-datatable',
        filter: false,
        sortOrder: sortOrder,
        serverSide: true,
        responsive: 'standard',
        selectableRows: 'none',
        download: false,
        print: false,
        count: totalData,
        customSearchRender: debounceSearchRender(750),
        onRowClick: (rowData, rowMeta) => onRowClick(data[rowMeta.dataIndex]),
        onTableInit: fetchData,
        onTableChange: (action, tableState) => {
            if (action === 'sort') {
                setSortOrder({
                    name: tableState.sortOrder.name,
                    direction: tableState.sortOrder.direction,
                })
            }

            if (
                ['sort', 'changePage', 'changeRowsPerPage', 'search'].includes(
                    action,
                )
            ) {
                fetchData(action, tableState)
            }
        },
    }

    return (
        <Box>
            <MUIDataTable
                title={'Riwayat Pinjaman'}
                data={data}
                columns={columns}
                options={options}
            />
            <LoadingCenter
                isShow={isLoading}
                sx={{
                    position: 'absolute',
                    top: '25%',
                    left: '50%',
                }}
            />
        </Box>
    )
}

LoanDatatable.propTypes = {
    mode: PropTypes.oneOf(['manager', 'applier']).isRequired,
}

export default LoanDatatable
