import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import type SurveyORM from '../../_orms/survey'

interface SurveySettingsDialogProps {
    open: boolean
    onClose: () => void
    survey: SurveyORM
    onUpdate: (data: {
        name: string
        settings: SurveyORM['settings']
    }) => Promise<void>
}

export default function SurveySettingsDialog({
    open,
    onClose,
    survey,
    onUpdate,
}: SurveySettingsDialogProps) {
    const [name, setName] = useState(survey.name)
    const [closed, setClosed] = useState(survey.settings?.closed || false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setName(survey.name)
            setClosed(survey.settings?.closed || false)
        }
    }, [open, survey])

    const handleSave = async () => {
        setLoading(true)
        try {
            await onUpdate({
                name,
                settings: {
                    ...survey.settings,
                    closed,
                },
            })
            onClose()
        } catch {
            // Error handled by parent
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
            <DialogTitle>Pengaturan Survey</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Nama Survey"
                    margin="normal"
                    onChange={e => setName(e.target.value)}
                    value={name}
                    variant="outlined"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={closed}
                            onChange={e => setClosed(e.target.checked)}
                        />
                    }
                    label="Tutup Survey (Tidak menerima respons baru)"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button
                    disabled={loading}
                    onClick={handleSave}
                    variant="contained">
                    Simpan
                </Button>
            </DialogActions>
        </Dialog>
    )
}
