// types
import type { MUIDataTableOptions } from 'mui-datatables'
import type { Mutate, DatatableProps } from './@types'
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
import { useHooks } from './hooks'
// utils
// import DownloadConfirmationDialog from './components/DownloadConfirmationDialog'
import { CLICKABLE_INFO } from './statics'
import CustomHeadButton from './components/CustomHeadButton'

const MUIDataTable = dynamic(() => import('mui-datatables'), {
    ssr: false,
})

let getRowData: <T = unknown>(index: number) => T | undefined
let mutatorForExport: Mutate

/**
 * Datatable component
 *
 * @todo Add large data download confirmation dialog
 * @todo Don't make `getRowData` global, it will cause bugs when datatable instance is more than one
 * @todo table state always restart when data changed
 */
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
        data,
        mutate,
        isLoading,
        columns,
        // isDownloadConfirmationDialogOpen,
        options: optionsFromHook,
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
        rowHover: isRowClickable,
        download: download ? (isLoading ? 'disabled' : true) : false,
        customToolbar: () => (
            <CustomHeadButton
                aria-label="Refresh"
                disabled={isLoading}
                onClick={() => mutate()}>
                <RefreshIcon />
            </CustomHeadButton>
        ),
        onRowClick: onRowClick as MUIDataTableOptions['onRowClick'],
        ...optionsFromHook,
        ...props,
    }

    return (
        <Box sx={sxs.tableParent}>
            <Fade in={isLoading}>
                <LinearProgress sx={sxs.loadingTop} />
            </Fade>

            <MUIDataTable
                title={title}
                data={data as object[]}
                columns={columns}
                options={options}
                components={{
                    icons: {
                        // @ts-expect-error - MuiDatatable kocak tipenya salah
                        DownloadIcon: DownloadIcon,
                    },
                }}
            />

            <Fade in={isLoading}>
                <LinearProgress sx={sxs.loadingBottom} />
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
