import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

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
        <Dialog maxWidth="xs" open={open}>
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
                <Button color="inherit" onClick={onAgree} size="small">
                    Ya
                </Button>
                <Button autoFocus color="success" onClick={onDisagree}>
                    Tidak
                </Button>
            </DialogActions>
        </Dialog>
    )
}
