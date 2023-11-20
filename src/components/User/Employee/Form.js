// vendors
import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
// components
import SelectInputFromApi from '@/components/SelectInputFromApi'
import DatePicker from '@/components/DatePicker'
// providers
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

const EmployeeForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const { data: user } = useUserWithDetails()

    const {
        data: employee = {},
        handleClose,
        isDataNotUndefined,
    } = useFormData()

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

        const formData = new FormData(e.target)

        const joined_at = formData.get('joined_at')
        if (joined_at)
            formData.set(
                'joined_at',
                dayjs(joined_at, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            )

        const unjoined_at = formData.get('unjoined_at')
        if (unjoined_at)
            formData.set(
                'unjoined_at',
                dayjs(unjoined_at, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            )

        return axios
            .post(`/users/${user.uuid}/employee`, formData)
            .then(() => {
                mutate(`/users/${user.uuid}`)
                handleClose()
            })
            .catch(error => {
                setIsLoading(false)
                if (error?.response?.status === 422) {
                    setValidationErrors(error.response.data.errors)
                } else {
                    throw error
                }
            })
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
                {...errorsToHelperTextObj(validationErrors.employee_status_id)}
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
                {...errorsToHelperTextObj(validationErrors.position)}
            />

            <DatePicker
                disabled={isLoading}
                defaultValue={joined_at ? dayjs(joined_at) : null}
                slotProps={{
                    textField: {
                        required: false,
                        name: 'joined_at',
                        label: 'Tanggal Bergabung',
                        onChange: clearValidationErrors,
                        ...errorsToHelperTextObj(validationErrors.joined_at),
                    },
                }}
            />

            <DatePicker
                disabled={isLoading}
                defaultValue={unjoined_at ? dayjs(unjoined_at) : null}
                slotProps={{
                    textField: {
                        required: false,
                        name: 'unjoined_at',
                        label: 'Tanggal Keluar',
                        onChange: clearValidationErrors,
                        ...errorsToHelperTextObj(validationErrors.unjoined_at),
                    },
                }}
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
                {...errorsToHelperTextObj(validationErrors.unjoined_reason)}
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
                {...errorsToHelperTextObj(validationErrors.note)}
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
