'use client'

// icons
import PrintIcon from '@mui/icons-material/Print'
import type { IconButtonProps } from '@mui/material/IconButton'
// materials
import IconButton from '@mui/material/IconButton'
import type { TooltipProps } from '@mui/material/Tooltip'
import Tooltip from '@mui/material/Tooltip'
// types
import type { ReactNode } from 'react'
// vendors
import { memo, useRef } from 'react'
import { type UseReactToPrintOptions, useReactToPrint } from 'react-to-print'
import PrintLayout from '@/components/print-layout'

const PrintHandler = memo(function PrintHandler({
    content,
    children,
    slotProps,
    ...props
}: Omit<UseReactToPrintOptions, 'content'> & {
    slotProps?: {
        printButton?: IconButtonProps
        tooltip?: Omit<TooltipProps, 'children'>
    }
} & (
        | { content: ReactNode; children?: never }
        | { content?: never; children: ReactNode }
    )) {
    const tooltipProps: Omit<TooltipProps, 'children'> = {
        arrow: true,
        placement: 'top',
        title: 'Cetak',
        ...(slotProps?.tooltip ?? {}),
    }

    const printButtonProps: IconButtonProps = {
        size: 'small',
        ...(slotProps?.printButton ?? {}),
        children: slotProps?.printButton?.children ?? <PrintIcon />,
    }

    const toPrintContentRef = useRef(null)
    const reactToPrintFn = useReactToPrint({
        // pageStyle: '@page { size: auto; margin: auto; }',
        contentRef: toPrintContentRef,
        pageStyle: '@media print { body { margin: auto; } }',
        ...props,
    })

    return (
        <Tooltip {...tooltipProps}>
            <span>
                <IconButton
                    onClick={() => reactToPrintFn()}
                    size="small"
                    {...printButtonProps}
                />
                <span
                    style={{
                        display: 'none',
                    }}>
                    <span ref={toPrintContentRef}>
                        <PrintLayout>{content ?? children}</PrintLayout>
                    </span>
                </span>
            </span>
        </Tooltip>
    )
})

export default PrintHandler
