// types
import type { ReactNode } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { TooltipProps } from '@mui/material/Tooltip'
// vendors
import { memo, useRef } from 'react'
import ReactToPrint from 'react-to-print'
import PrintLayout from '@/components/Layouts/PrintLayout'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import PrintIcon from '@mui/icons-material/Print'

const PrintHandler = memo(function PrintHandler({
    content,
    children,
    slotProps,
}: {
    slotProps?: {
        printButton?: IconButtonProps
        tooltip?: Omit<TooltipProps, 'children'>
    }
} & (
    | { content: ReactNode; children?: never }
    | { content?: never; children: ReactNode }
)) {
    const {
        tooltip: { title = 'Cetak', placement = 'top', ...tooltipProps } = {},
        printButton = {},
    } = slotProps ?? {}
    const toPrintContentRef = useRef(null)

    return (
        <>
            <ReactToPrint
                pageStyle="@page { margin: auto; }"
                content={() => toPrintContentRef.current}
                trigger={() => (
                    <Tooltip
                        title={title}
                        placement={placement}
                        {...tooltipProps}>
                        <span>
                            <IconButton {...printButton}>
                                <PrintIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                )}
            />

            <div
                style={{
                    display: 'none',
                }}>
                <div ref={toPrintContentRef}>
                    <PrintLayout>{content ?? children}</PrintLayout>
                </div>
            </div>
        </>
    )
})

export default PrintHandler
