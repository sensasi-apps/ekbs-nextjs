import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import LoadingButton from '@mui/lab/LoadingButton'

import SelectInputFromApi from '../../SelectInputFromApi'
import DatePicker from '../../DatePicker'
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'

const EmployeeForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const { data: user } = useUserWithDetails()

    const {
        data: employee = {},
        handleClose,
        isDataNotUndefined,
    } = useFormData()

    // ############################## HOOKS END ##############################

    if (!isDataNotUndefined) return null

    const {
        joined_at,
        unjoined_at,
        unjoined_reason,
        note,
        employee_status_id,
        position,
    } = employee

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target)

            await axios.post(`/users/${user.uuid}/employee`, formData)
            mutate(`/users/${user.uuid}`)

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

    const clearValidationErrors = event => {
        const { name } = event.target

        if (name in validationErrors) {
            setValidationErrors(prev => {
                prev[name] = undefined
                return prev
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <SelectInputFromApi
                endpoint="/data/employee-statuses"
                label="Status Karyawan"
                disabled={isLoading}
                name="employee_status_id"
                margin="normal"
                required
                selectProps={{
                    defaultValue: employee_status_id || '',
                }}
                onChange={clearValidationErrors}
                error={Boolean(validationErrors.employee_status_id)}
                helperText={validationErrors.employee_status_id}
            />

            <TextField
                fullWidth
                required
                disabled={isLoading}
                name="position"
                label="Jabatan"
                margin="normal"
                onChange={clearValidationErrors}
                defaultValue={position || ''}
                error={Boolean(validationErrors.position)}
                helperText={validationErrors.position}
            />

            <DatePicker
                required
                fullWidth
                disabled={isLoading}
                label="Tanggal Bergabung"
                margin="normal"
                name="joined_at"
                defaultValue={joined_at}
                onChange={() => {
                    if ('joined_at' in validationErrors) {
                        setValidationErrors(prev => {
                            prev.joined_at = undefined
                            return prev
                        })
                    }
                }}
                error={Boolean(validationErrors.joined_at)}
                helperText={validationErrors.joined_at}
            />

            <DatePicker
                fullWidth
                label="Tanggal Berhenti/Keluar"
                disabled={isLoading}
                margin="normal"
                name="unjoined_at"
                defaultValue={unjoined_at}
                onChange={() => {
                    if ('unjoined_at' in validationErrors) {
                        setValidationErrors(prev => {
                            prev.unjoined_at = undefined
                            return prev
                        })
                    }
                }}
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
                defaultValue={unjoined_reason || ''}
                onChange={clearValidationErrors}
                error={Boolean(validationErrors.unjoined_reason)}
                helperText={validationErrors.unjoined_reason}
            />

            <TextField
                fullWidth
                multiline
                name="note"
                disabled={isLoading}
                label="Catatan tambahan"
                margin="normal"
                defaultValue={note || ''}
                onChange={clearValidationErrors}
                error={Boolean(validationErrors.note)}
                helperText={validationErrors.note}
            />

            <Box display="flex" mt={2} justifyContent="end">
                <Button disabled={isLoading} onClick={handleClose}>
                    Batal
                </Button>
                <LoadingButton
                    variant="contained"
                    loading={isLoading}
                    type="submit">
                    Simpan
                </LoadingButton>
            </Box>
        </form>
    )
}

export default EmployeeForm
