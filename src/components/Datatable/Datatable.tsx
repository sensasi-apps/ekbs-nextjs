// types
import type { MUIDataTableOptions } from 'mui-datatables'
import type { Mutate, DatatableProps } from './@types'
import type { ReactNode } from 'react'
// vendors
import dynamic from 'next/dynamic'
import { Box, Fade, IconButton, LinearProgress, Tooltip } from '@mui/material'
import { Download, Refresh } from '@mui/icons-material'
// locals
import { useHooks } from './hooks'
import DownloadConfirmationDialog from './components/DownloadConfirmationDialog'
import sxs from './sxs'
// utils
import { CLICKABLE_INFO } from './statics'

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
 * @todo remove `unknown` type from main `Datatable` component
 */
export function Datatable<T>({
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
}: DatatableProps & Omit<MUIDataTableOptions, 'onRowClick'>) {
    const {
        data,
        mutate,
        isLoading,
        columns,
        isDownloadConfirmationDialogOpen,
        options: optionsFromHook,
    } = useHooks<T>(
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
        download:
            download || props.onDownload
                ? isLoading
                    ? 'disabled'
                    : download
                : false,
        customToolbar: () => (
            <Tooltip arrow title="Segarkan">
                <span>
                    <IconButton disabled={isLoading} onClick={() => mutate()}>
                        <Refresh />
                    </IconButton>
                </span>
            </Tooltip>
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
                        DownloadIcon: Download as unknown as ReactNode,
                    },
                }}
            />

            <Fade in={isLoading}>
                <LinearProgress sx={sxs.loadingBottom} />
            </Fade>

            {/**
             * PENDING
             */}
            {download && (
                <DownloadConfirmationDialog
                    open={isDownloadConfirmationDialogOpen}
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
