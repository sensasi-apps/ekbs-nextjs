import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { DownloadDialogProps } from './@types/DownloadDialogProps'

/**
 * @deprecated not implemented yet
 */
export function DownloadConfirmationDialog({
    open,
    nData,
    onAgree,
    onDisagree,
}: DownloadDialogProps) {
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
