'use client'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import type QuestionORM from '../../_orms/question'

type Props = {
    open: boolean
    onClose: () => void
    onSubmit: (data: Partial<QuestionORM>) => Promise<void>
    initialData?: Partial<QuestionORM>
    sectionId: number
}

const QUESTION_TYPES: Array<{
    value: QuestionORM['type']
    label: string
    description: string
}> = [
    {
        description: 'Menerima jawaban berupa teks',
        label: 'Teks',
        value: 'text',
    },
    {
        description: 'Menerima jawaban berupa angka',
        label: 'Angka',
        value: 'number',
    },
    {
        description: 'Pilihan berbentuk radio button, hanya 1 pilihan',
        label: 'Pilihan Tunggal',
        value: 'radio',
    },
    {
        description: 'Pilihan berbentuk checkbox, bisa memilih lebih dari 1',
        label: 'Pilihan Ganda',
        value: 'multiselect',
    },
]

export default function QuestionFormDialog({
    open,
    onClose,
    onSubmit,
    initialData,
    sectionId,
}: Props) {
    const [content, setContent] = useState(initialData?.content || '')
    const [type, setType] = useState<QuestionORM['type']>(
        initialData?.type || 'text',
    )
    const [options, setOptions] = useState<string[]>(initialData?.options || [])
    const [newOption, setNewOption] = useState('')
    const [isRequired, setIsRequired] = useState(
        initialData?.rules?.includes('required') ?? true,
    )
    const [isLoading, setIsLoading] = useState(false)

    const requiresOptions = ['radio', 'multiselect'].includes(type)

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert('Pertanyaan tidak boleh kosong')
            return
        }

        if (requiresOptions && options.length === 0) {
            alert('Tambahkan minimal 1 opsi untuk tipe pertanyaan ini')
            return
        }

        setIsLoading(true)
        try {
            const rules = (initialData?.rules || []).filter(
                r => r !== 'required',
            )
            if (isRequired) rules.push('required')

            await onSubmit({
                ...initialData,
                content: content.trim(),
                options: requiresOptions ? options : null,
                rules,
                section_id: sectionId,
                type,
            })
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddOption = () => {
        if (newOption.trim()) {
            setOptions([...options, newOption.trim()])
            setNewOption('')
        }
    }

    const handleDeleteOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { minHeight: 400 } }}>
            <DialogTitle>
                {initialData?.id ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    disabled={isLoading}
                    fullWidth
                    label="Pertanyaan"
                    margin="normal"
                    multiline
                    onChange={e => setContent(e.target.value)}
                    rows={3}
                    value={content}
                />

                <TextField
                    disabled={isLoading}
                    fullWidth
                    label="Tipe Pertanyaan"
                    margin="normal"
                    onChange={e =>
                        setType(e.target.value as QuestionORM['type'])
                    }
                    select
                    value={type}>
                    {QUESTION_TYPES.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            <Box>
                                <Box sx={{ fontWeight: 500 }}>
                                    {option.label}
                                </Box>
                                <Box
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.75rem',
                                    }}>
                                    {option.description}
                                </Box>
                            </Box>
                        </MenuItem>
                    ))}
                </TextField>

                <FormControlLabel
                    control={
                        <Switch
                            checked={isRequired}
                            disabled={isLoading}
                            onChange={e => setIsRequired(e.target.checked)}
                        />
                    }
                    label="Wajib Diisi"
                />

                {requiresOptions && (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            disabled={isLoading}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={handleAddOption}
                                        size="small">
                                        <AddIcon />
                                    </IconButton>
                                ),
                            }}
                            label="Tambah Opsi"
                            onChange={e => setNewOption(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddOption()
                                }
                            }}
                            size="small"
                            value={newOption}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                mt: 1,
                            }}>
                            {options.map((option, index) => (
                                <Chip
                                    deleteIcon={<CloseIcon />}
                                    key={option}
                                    label={option}
                                    onDelete={() => handleDeleteOption(index)}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button disabled={isLoading} onClick={onClose}>
                    Batal
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    variant="contained">
                    {initialData?.id ? 'Simpan' : 'Tambah'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
