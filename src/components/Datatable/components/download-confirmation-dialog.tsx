import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button, { type ButtonProps } from '@mui/material/Button'

/**
 * @deprecated not implemented yet
 */
export function DownloadConfirmationDialog({
    open,
    nData,
    onAgree,
    onDisagree,
}: {
    open: DialogProps['open']
    nData: number
    onAgree: ButtonProps['onClick']
    onDisagree: ButtonProps['onClick']
}) {
    return (
        <Dialog open={open} maxWidth="xs">
            <DialogTitle>Ukuran Data Sangat Besar</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Data yang akan diunduh memiliki {nData} baris yang mungkin
                    memerlukan waktu yang lama untuk mengunduhnya.
                </DialogContentText>

                <DialogContentText>
                    Apakah Anda ingin tetap melanjutkan proses unduh?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onAgree} color="inherit" size="small">
                    Ya
                </Button>
                <Button onClick={onDisagree} color="success" autoFocus>
                    Tidak
                </Button>
            </DialogActions>
        </Dialog>
    )
}
