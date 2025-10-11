'use client'

// icons-materials
import Refresh from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'
// vendors
import VendorDataTable, {
    type DataTableProps as VendorDataTableProps,
    type DataTableOptions as VendorDatatableOptions,
} from 'mui-datatable-delight'
// types
import type { DatatableProps, Mutate } from './@types'
// locals
import useHooks from './hooks/use-hooks'
// import { DownloadConfirmationDialog } from './components/DownloadConfirmationDialog'
// utils
import { CLICKABLE_INFO } from './statics'

let getRowData: <T = unknown>(index: number) => T | undefined
let mutatorForExport: Mutate

/**
 * Datatable component
 *
 * @todo Add large data download confirmation dialog
 * @todo Don't make `getRowData` global, it will cause bugs when datatable instance is more than one
 * @todo table state always restart when data changed
 * @todo remove `unknown` type from main `Datatable` component
 */
export function Datatable<T>({
    apiUrl,
    apiUrlParams,
    columns: columnsFromProps,
    defaultSortOrder,
    tableId,
    title,
    onRowClick,
    mutateCallback,
    getRowDataCallback,
    swrOptions,
    download = false,
    ...props
}: DatatableProps<T>) {
    const {
        data,
        mutate,
        isLoading,
        columns,
        options: optionsFromHook,
        // isDownloadConfirmationDialogOpen,
    } = useHooks<T>(
        tableId,
        columnsFromProps,
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

    const options: VendorDataTableProps<T>['options'] = {
        customToolbar: () => (
            <Tooltip arrow title="Segarkan">
                <span>
                    <IconButton disabled={isLoading} onClick={() => mutate()}>
                        <Refresh />
                    </IconButton>
                </span>
            </Tooltip>
        ),
        download:
            download || props.onDownload
                ? isLoading
                    ? 'disabled'
                    : download
                : false,
        onRowClick: onRowClick as VendorDatatableOptions['onRowClick'],
        rowHover: isRowClickable,
        ...optionsFromHook,
        ...props,
    }

    return (
        <Box
            sx={{
                '& tbody .MuiTableRow-hover': {
                    cursor: 'pointer',
                },
                '& td, & th': {
                    p: 1,
                },
                mozUserSelect: 'none',
                msUserSelect: 'none',
                translate: '0 -4px',
                userSelect: 'none',
                webkitUserSelect: 'none',
            }}>
            <Fade in={isLoading}>
                <LinearProgress
                    sx={{
                        borderTopLeftRadius: 11,
                        borderTopRightRadius: 11,
                        translate: '0 4px',
                        zIndex: 1,
                    }}
                />
            </Fade>

            <VendorDataTable
                columns={columns}
                data={data}
                options={options}
                textLabels={TEXT_LABELS}
                title={title}
            />

            <Fade in={isLoading}>
                <LinearProgress
                    sx={{
                        borderBottomLeftRadius: 11,
                        borderBottomRightRadius: 11,
                        translate: '0 -4px',
                        zIndex: 1,
                    }}
                />
            </Fade>

            {/**
             * PENDING
             */}
            {/* {download && (
                <DownloadConfirmationDialog
                    open={isDownloadConfirmationDialogOpen}
                    nData={10}
                    onAgree={() => {}}
                    onDisagree={() => {}}
                />
            )} */}

            {isRowClickable && CLICKABLE_INFO}
        </Box>
    )
}

export { getRowData, mutatorForExport as mutate }

const TEXT_LABELS: VendorDataTableProps['textLabels'] = {
    body: {
        noMatch: 'Tidak ada data yang tersedia',
        toolTip: 'Urutkan',
    },
    pagination: {
        jumpToPage: 'halaman:',
        next: 'selanjutnya',
        previous: 'sebelumnya',
        rowsPerPage: 'data/halaman:',
    },
    toolbar: {
        downloadCsv: 'Unduh',
        print: 'Cetak',
        search: 'Cari',
        viewColumns: 'Tampilkan kolom',
    },
}
