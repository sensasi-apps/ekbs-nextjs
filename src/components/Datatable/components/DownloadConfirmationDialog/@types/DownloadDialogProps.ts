import type { DialogProps } from '@mui/material/Dialog'
import type { ButtonProps } from '@mui/material/Button'

export type DownloadDialogProps = {
    open: DialogProps['open'],
    nData: number,
    onAgree: ButtonProps['onClick'],
    onDisagree: ButtonProps['onClick'],
}
