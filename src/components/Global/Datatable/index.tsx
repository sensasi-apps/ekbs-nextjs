import axios from '@/lib/axios'
import { FC, useState } from 'react'
import useSWR from 'swr'
import MUIDataTable, {
    MUIDataTableColumn,
    MUIDataTableOptions,
    MUIDataTableState,
    MUISortOptions,
    debounceSearchRender,
} from 'mui-datatables'
import QueryString from 'qs'
import { ACTIONS_ALLOW_FETCH, formatToDatatableParams } from '@/lib/datatable'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

const fetcher = (url: string, params: object) =>
    axios
        .get(url, {
            params: params,
            paramsSerializer: params => QueryString.stringify(params),
        })
        .then(res => res.data)
        .catch(error => {
            if (![401].includes(error.response.status)) throw error
        })

interface DatatableProps {
    apiUrl: string
    columns: MUIDataTableColumn[]
    defaultSortOrder: MUISortOptions
    tableId: string
    title?: string
    onRowClick?: (rowData: any, rowMeta: any) => void
}

let params: object

let getDataRow: (index: number) => any

const Datatable: FC<DatatableProps> = ({
    title,
    tableId,
    apiUrl,
    columns,
    onRowClick,
    defaultSortOrder,
}) => {
    const {
        isLoading: isApiLoading,
        data: { data = [], recordsTotal } = {},
        mutate,
    } = useSWR(params ? apiUrl : null, (url: string) => fetcher(url, params))

    const [isLoading, setIsloading] = useState(false)

    const [sortOrder, setSortOrder] = useState<MUISortOptions>(defaultSortOrder)

    getDataRow = (index: number) => data[index]

    const handleFetchData = async (
        action: string,
        tableState: MUIDataTableState,
    ) => {
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

        setIsloading(true)
        params = formatToDatatableParams(tableState, columns)
        await mutate()
        setIsloading(false)
    }

    const options: MUIDataTableOptions = {
        tableId: tableId,
        filter: false,
        sortOrder: sortOrder,
        serverSide: true,
        responsive: 'standard',
        selectableRows: 'none',
        download: false,
        print: false,
        count: recordsTotal || 0,
        customSearchRender: debounceSearchRender(750),
        onRowClick: onRowClick,
        onTableInit: handleFetchData,
        onTableChange: handleFetchData,
    }

    return (
        <div>
            <MUIDataTable
                title={title}
                data={data || []}
                columns={columns}
                options={options}
            />

            <LoadingCenter
                isShow={isLoading || isApiLoading}
                position="fixed"
                top="25%"
                left="50%"
            />
        </div>
    )
}

export default Datatable

export { getDataRow }
