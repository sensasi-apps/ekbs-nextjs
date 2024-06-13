// types
import type { MUIDataTableOptions } from 'mui-datatables'
import type { Mutate, DatatableProps } from './@types'
import type { ReactNode } from 'react'
// vendors
import dynamic from 'next/dynamic'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
// icons
import DownloadIcon from '@mui/icons-material/Download'
import RefreshIcon from '@mui/icons-material/Refresh'
// locals
import sxs from './sxs'
import staticOptions from './staticOptions'
import { useHooks } from './hooks'
// utils
import DownloadConfirmationDialog from './components/DownloadConfirmationDialog'
import { CLICKABLE_INFO } from './statics'
import CustomHeadButton from './components/CustomHeadButton'

const MUIDataTable = dynamic(() => import('mui-datatables'), {
    ssr: false,
})

/**
 * @todo
 * - [ ] Don't make this global, it will cause bugs when datatable instance is more than one
 * - [ ] table state always restart when data changed
 */

let getRowData: <T = unknown>(index: number) => T | undefined
let mutatorForExport: Mutate

export function Datatable({
    apiUrl,
    apiUrlParams,
    columns: defaultColumns,
    defaultSortOrder,
    tableId,
    title,
    onRowClick,
    mutateCallback,
    getRowDataCallback,
    swrOptions,
    download = false,
    ...props
}: DatatableProps & Omit<MUIDataTableOptions, 'onRowClick' | 'onDownload'>) {
    const {
        state,
        swr: {
            data: { data = [], recordsTotal, recordsFiltered } = {},
            mutate,
        },
        handleColumnSortChange,
        handleViewColumnsChange,
        handleOnDownload,
        handleTableChange,
    } = useHooks(
        tableId,
        defaultColumns,
        defaultSortOrder,
        apiUrl,
        apiUrlParams,
        swrOptions,
    )

    // TODO: remove ts-expect-error when getRowData and mutatorForExport is not global
    // @ts-expect-error getRowData and mutatorForExport is global
    getRowData = index => data[index]
    mutatorForExport = () => mutate()

    getRowDataCallback?.(index => data[index])
    mutateCallback?.(mutate)

    const isRowClickable = Boolean(onRowClick)

    const options: MUIDataTableOptions = {
        ...staticOptions,
        tableId: tableId,
        sortOrder: state.sortOrder,
        count: recordsFiltered ?? recordsTotal ?? 0,
        rowHover: isRowClickable,
        download: download ? (state.isLoading ? 'disabled' : true) : false,
        customToolbar: () => (
            <CustomHeadButton
                aria-label="Refresh"
                disabled={state.isLoading}
                onClick={() => mutate()}>
                <RefreshIcon />
            </CustomHeadButton>
        ),
        onRowClick: onRowClick as MUIDataTableOptions['onRowClick'],
        onTableInit: handleTableChange,
        onTableChange: handleTableChange,
        onViewColumnsChange: handleViewColumnsChange,
        onColumnSortChange: handleColumnSortChange,
        onDownload: handleOnDownload,
        textLabels: {
            body: {
                noMatch: state.isLoading
                    ? 'Memuat data...'
                    : 'Tidak ada data yang tersedia',
                toolTip: 'Urutkan',
            },
            pagination: {
                next: 'Selanjutnya',
                previous: 'Sebelumnya',
                rowsPerPage: 'Baris per halaman:',
                jumpToPage: 'Pergi ke halaman:',
            },
            toolbar: {
                search: 'Cari',
                downloadCsv: 'Unduh',
                print: 'Cetak',
                viewColumns: 'Tampilkan kolom',
            },
        },
        ...props,
    }

    return (
        <Box sx={sxs.tableParent}>
            <Fade in={state.isLoading}>
                <LinearProgress sx={sxs.loadingTop} />
            </Fade>

            <MUIDataTable
                title={title}
                data={data as object[]}
                columns={state.columns}
                options={options}
                components={{
                    icons: {
                        DownloadIcon: DownloadIcon as unknown as ReactNode,
                    },
                }}
            />

            <Fade in={state.isLoading}>
                <LinearProgress sx={sxs.loadingBottom} />
            </Fade>

            {download && (
                <DownloadConfirmationDialog
                    open={state.isDownloadConfirmationDialogOpen}
                    nData={10}
                    onAgree={() => {}}
                    onDisagree={() => {}}
                />
            )}

            {isRowClickable && CLICKABLE_INFO}
        </Box>
    )
}

export { getRowData, mutatorForExport as mutate }
