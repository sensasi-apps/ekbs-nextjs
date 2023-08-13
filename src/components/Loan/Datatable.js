import PropTypes from 'prop-types'

import { useState } from 'react'
import axios from '@/lib/axios'
import useSWRMutation from 'swr/mutation'
import QueryString from 'qs'
import moment from 'moment'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MUIDataTable, { debounceSearchRender } from 'mui-datatables'

import numberFormat from '@/lib/numberFormat'
import LoadingCenter from '../Statuses/LoadingCenter'
import Loan from '@/classes/loan'
import { ACTIONS_ALLOW_FETCH, formatToDatatableParams } from '@/lib/datatable'

const LoanDatatable = ({ mode, onRowClick }) => {
    const {
        isMutating: isLoading,
        data: datatableResponse,
        trigger,
    } = useSWRMutation(
        mode === 'manager' ? '/user-loans/datatable' : '/loans/datatable',
        (url, { arg: params }) =>
            axios
                .get(url, {
                    params: params,
                    paramsSerializer: params => QueryString.stringify(params),
                })
                .then(res => res.data)
                .catch(error => {
                    if (![401].includes(error.response.status)) throw error
                }),
    )
    const data = datatableResponse?.data || []

    const [sortOrder, setSortOrder] = useState({
        name: 'proposed_at',
        direction: 'desc',
    })

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
            name: 'user.id',
            label: 'ID Pengguna',
            options: {
                display: false,
                customBodyRender: (value, tableMeta) =>
                    data[tableMeta.rowIndex]['user']['id'],
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

    const handleFetchData = async (action, tableState) => {
        if (!ACTIONS_ALLOW_FETCH.includes(action)) {
            return false
        }

        if (action === 'sort') {
            setSortOrder(prev => {
                prev.name = tableState.sortOrder.name
                prev.direction = tableState.sortOrder.direction

                return prev
            })
        }

        trigger(formatToDatatableParams(tableState, columns))
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
        count: datatableResponse?.recordsTotal || 0,
        customSearchRender: debounceSearchRender(750),
        onRowClick: (rowData, rowMeta) => onRowClick(data[rowMeta.dataIndex]),
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
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
                position="fixed"
                top="25%"
                left="50%"
            />
        </Box>
    )
}

LoanDatatable.propTypes = {
    mode: PropTypes.oneOf(['manager', 'applier']).isRequired,
}

export default LoanDatatable
