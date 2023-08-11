import { useEffect, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import axios from '@/lib/axios'
import QueryString from 'qs'
import moment from 'moment'

import Box from '@mui/material/Box'

import MUIDataTable, { debounceSearchRender } from 'mui-datatables'

import numberFormat from '@/lib/numberFormat'

import LoadingCenter from '../Statuses/LoadingCenter'
import useFormData from '@/providers/FormData'
import { ACTIONS_ALLOW_FETCH, formatToDatatableParams } from '@/lib/datatable'

const TransactionsDatatable = () => {
    const { handleEdit, isDataNotUndefined } = useFormData()

    const {
        isMutating: isLoading,
        data: datatableResponse,
        trigger,
    } = useSWRMutation(
        '/transactions/datatable',
        (url, { arg: params }) =>
            axios
                .get(url, {
                    params: params,
                    paramsSerializer: params => QueryString.stringify(params),
                })
                .then(res => res.data),
        {
            revalidateOnFocus: false,
        },
    )

    const data = datatableResponse?.data || []

    const [sortOrder, setSortOrder] = useState({
        name: 'at',
        direction: 'desc',
    })
    const [params, setParams] = useState({})

    useEffect(() => {
        if (!isDataNotUndefined && Boolean(datatableResponse?.data)) {
            trigger(params)
        }
    }, [isDataNotUndefined])

    const columns = [
        {
            name: 'uuid',
            label: 'uuid',
            options: {
                display: false,
            },
        },
        {
            name: 'at',
            label: 'Tanggal',
            options: {
                customBodyRender: value => moment(value).format('DD MMMM YYYY'),
            },
        },
        {
            name: 'cash.code',
            label: 'Kode Kas',
            options: {
                customBodyRender: (value, tableMeta) =>
                    data[tableMeta.rowIndex].cash.code,
            },
        },
        {
            name: 'amount',
            label: 'Nilai',
            options: {
                customBodyRender: value => numberFormat(value),
            },
        },
        {
            name: 'desc',
            label: 'Perihal',
        },

        {
            name: 'userActivityLogs.user.name',
            label: 'Oleh',
            options: {
                customBodyRender: (value, tableMeta) =>
                    data[tableMeta.rowIndex].user_activity_logs[0]?.user.name,
            },
        },
    ]

    const handleFetchData = (action, tableState) => {
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

        setParams(prev => {
            prev = formatToDatatableParams(tableState, columns)
            trigger(prev)

            return prev
        })
    }

    const options = {
        tableId: 'tansactions-datatable',
        filter: false,
        sortOrder: sortOrder,
        serverSide: true,
        responsive: 'standard',
        selectableRows: 'none',
        download: false,
        print: false,
        count: datatableResponse?.recordsTotal || 0,
        customSearchRender: debounceSearchRender(750),
        onRowClick: (rowData, rowMeta) => handleEdit(data[rowMeta.dataIndex]),
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
    }

    return (
        <Box>
            <MUIDataTable
                title={'Riwayat Transaksi'}
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

export default TransactionsDatatable
