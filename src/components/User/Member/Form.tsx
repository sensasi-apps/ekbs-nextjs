// vendors

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { useState } from 'react'
import { mutate } from 'swr'
//components
import DatePicker from '@/components/date-picker'
import TextField from '@/components/text-field'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
import axios from '@/lib/axios'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
// providers
import useFormData from '@/providers/FormData'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import errorCatcher from '@/utils/handle-422'

export default function MemberForm() {
    const { data: userWithDetails } = useUserDetailSwr()
    const { handleClose } = useFormData()

    const { uuid: userUuid, member } = userWithDetails ?? {}

    const [isLoading, setIsLoading] = useState(false)
    const { validationErrors, setValidationErrors, clearByEvent, clearByName } =
        useValidationErrors()

    return (
        <form
            onSubmit={event => {
                event.preventDefault()

                setIsLoading(true)
                const formData = new FormData(event.currentTarget)

                const joinedAt = formData.get('joined_at') as string
                if (joinedAt) {
                    formData.set(
                        'joined_at',
                        dayjs(joinedAt, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    )
                }

                const unjoinedAt = formData.get('unjoined_at') as string
                if (unjoinedAt) {
                    formData.set(
                        'unjoined_at',
                        dayjs(unjoinedAt, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    )
                }

                return axios
                    .post(`/users/${userUuid}/member`, formData)
                    .then(() => {
                        mutate(`users/${userUuid}`)
                        handleClose()
                    })
                    .catch(error => errorCatcher(error, setValidationErrors))
                    .finally(() => setIsLoading(false))
            }}>
            <DatePicker
                defaultValue={
                    member?.joined_at ? dayjs(member?.joined_at) : null
                }
                disabled={isLoading}
                label="Tanggal Bergabung"
                onChange={() => clearByName('joined_at')}
                slotProps={{
                    textField: {
                        name: 'joined_at',
                        ...errorsToHelperTextObj(validationErrors.joined_at),
                    },
                }}
            />

            <DatePicker
                defaultValue={
                    member?.unjoined_at ? dayjs(member?.unjoined_at) : null
                }
                disabled={isLoading}
                label="Tanggal Berhenti/Keluar"
                onChange={() => clearByName('unjoined_at')}
                slotProps={{
                    textField: {
                        name: 'unjoined_at',
                        required: false,
                        ...errorsToHelperTextObj(validationErrors.unjoined_at),
                    },
                }}
            />

            <TextField
                defaultValue={member?.unjoined_reason || ''}
                disabled={isLoading}
                label="Alasan Berhenti/Keluar"
                multiline
                name="unjoined_reason"
                onChange={clearByEvent}
                required={false}
                rows={2}
                {...errorsToHelperTextObj(validationErrors.unjoined_reason)}
            />

            <TextField
                defaultValue={member?.note || ''}
                disabled={isLoading}
                label="Catatan tambahan"
                multiline
                name="note"
                onChange={clearByEvent}
                required={false}
                rows={2}
                {...errorsToHelperTextObj(validationErrors.note)}
            />

            <Box display="flex" justifyContent="end" mt={2}>
                <Button
                    color="info"
                    disabled={isLoading}
                    onClick={() => handleClose()}>
                    Batal
                </Button>
                <Button
                    color="info"
                    loading={isLoading}
                    type="submit"
                    variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
