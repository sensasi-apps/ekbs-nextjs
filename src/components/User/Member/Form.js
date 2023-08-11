import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import DatePicker from '../../DatePicker'

import useUserWithDetails from '@/providers/UserWithDetails'
import useFormData from '@/providers/FormData'
import { LoadingButton } from '@mui/lab'

const MemberForm = () => {
    const { data: userWithDetails = {} } = useUserWithDetails()
    const { handleClose } = useFormData()

    const { uuid: userUuid, member } = userWithDetails

    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    // ####### FUNCTIONS #########

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.target)

        try {
            await axios.post(`/users/${userUuid}/member`, formData)
            await mutate(`/users/${userUuid}`)

            handleClose()
        } catch (error) {
            if (error?.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

    const clearValidationErrors = e => {
        const { name } = e.target

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null,
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <DatePicker
                required
                fullWidth
                disabled={isLoading}
                onChange={() =>
                    clearValidationErrors({
                        target: {
                            name: 'joined_at',
                        },
                    })
                }
                label="Tanggal Bergabung"
                margin="normal"
                name="joined_at"
                defaultValue={member?.joined_at || null}
                error={Boolean(validationErrors.joined_at)}
                helperText={validationErrors.joined_at}
            />

            <DatePicker
                fullWidth
                disabled={isLoading}
                label="Tanggal Berhenti/Keluar"
                margin="normal"
                name="unjoined_at"
                onChange={() =>
                    clearValidationErrors({
                        target: {
                            name: 'joined_at',
                        },
                    })
                }
                defaultValue={member?.unjoined_at || null}
                error={Boolean(validationErrors.unjoined_at)}
                helperText={validationErrors.unjoined_at}
            />

            <TextField
                fullWidth
                multiline
                disabled={isLoading}
                name="unjoined_reason"
                label="Alasan Berhenti/Keluar"
                margin="normal"
                onChange={clearValidationErrors}
                defaultValue={member?.unjoined_reason || ''}
                error={Boolean(validationErrors.unjoined_reason)}
                helperText={validationErrors.unjoined_reason}
            />

            <TextField
                fullWidth
                multiline
                disabled={isLoading}
                name="note"
                label="Catatan tambahan"
                margin="normal"
                onChange={clearValidationErrors}
                defaultValue={member?.note || ''}
                error={Boolean(validationErrors.note)}
                helperText={validationErrors.note}
            />

            <Box display="flex" mt={2} justifyContent="end">
                <Button disabled={isLoading} onClick={handleClose} color="info">
                    Batal
                </Button>
                <LoadingButton
                    loading={isLoading}
                    type="submit"
                    color="info"
                    variant="contained">
                    Simpan
                </LoadingButton>
            </Box>
        </form>
    )
}

export default MemberForm
