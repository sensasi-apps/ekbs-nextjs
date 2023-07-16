import { mutate } from 'swr'
import { useContext, useState } from 'react'

import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

import DeleteIcon from '@mui/icons-material/Delete'
import AppContext from '@/providers/App'

export default function CashForm({ data: cash, handleClose }) {
    const {
        auth: { userHasPermission },
    } = useContext(AppContext)

    const isUserCanDelete = userHasPermission('cashes delete')

    const [validationErrors, setValidationErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()

        setIsSubmitting(true)

        try {
            const formData = new FormData(e.target)

            await axios.post('cashes', formData)
            await mutate(`data/cashes`)

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsSubmitting(false)
    }

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            await axios.delete(`/cashes/${cash.uuid}`)
            await mutate(`data/cashes`)

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsDeleting(false)
    }

    const handleChange = e => {
        const { name } = e.target

        setValidationErrors(prev => ({ ...prev, [name]: undefined }))
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="uuid" defaultValue={cash?.uuid} />

            <TextField
                disabled={isSubmitting || isDeleting}
                fullWidth
                required
                margin="dense"
                name="code"
                label="Kode"
                onChange={handleChange}
                defaultValue={cash?.code}
                error={Boolean(validationErrors.code)}
                helperText={validationErrors.code}
            />

            <TextField
                fullWidth
                disabled={isSubmitting || isDeleting}
                required
                margin="dense"
                name="name"
                label="Nama"
                onChange={handleChange}
                defaultValue={cash?.name}
                error={Boolean(validationErrors.name)}
                helperText={validationErrors.name}
            />

            <Box
                mt={2}
                display="flex"
                justifyContent={
                    cash?.uuid && isUserCanDelete ? 'space-between' : 'end'
                }>
                {cash?.uuid && isUserCanDelete && (
                    <LoadingButton
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                        loading={isDeleting}
                        disabled={isSubmitting}
                        startIcon={<DeleteIcon />}>
                        Hapus
                    </LoadingButton>
                )}

                <Box>
                    <Button
                        type="reset"
                        disabled={isSubmitting || isDeleting}
                        onClick={handleClose}>
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={isDeleting}>
                        Simpan
                    </LoadingButton>
                </Box>
            </Box>
        </form>
    )
}
