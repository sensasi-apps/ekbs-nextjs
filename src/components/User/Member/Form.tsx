// vendors
import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
//components
import DatePicker from '@/components/DatePicker'
import TextField from '@/components/TextField'
// providers
import useFormData from '@/providers/FormData'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
import errorCatcher from '@/utils/handle-422'
import dayjs from 'dayjs'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'

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
                label="Tanggal Bergabung"
                disabled={isLoading}
                defaultValue={
                    member?.joined_at ? dayjs(member?.joined_at) : null
                }
                onChange={() => clearByName('joined_at')}
                slotProps={{
                    textField: {
                        name: 'joined_at',
                        ...errorsToHelperTextObj(validationErrors.joined_at),
                    },
                }}
            />

            <DatePicker
                label="Tanggal Berhenti/Keluar"
                disabled={isLoading}
                defaultValue={
                    member?.unjoined_at ? dayjs(member?.unjoined_at) : null
                }
                onChange={() => clearByName('unjoined_at')}
                slotProps={{
                    textField: {
                        required: false,
                        name: 'unjoined_at',
                        ...errorsToHelperTextObj(validationErrors.unjoined_at),
                    },
                }}
            />

            <TextField
                multiline
                rows={2}
                disabled={isLoading}
                name="unjoined_reason"
                label="Alasan Berhenti/Keluar"
                onChange={clearByEvent}
                defaultValue={member?.unjoined_reason || ''}
                required={false}
                {...errorsToHelperTextObj(validationErrors.unjoined_reason)}
            />

            <TextField
                multiline
                rows={2}
                disabled={isLoading}
                name="note"
                label="Catatan tambahan"
                onChange={clearByEvent}
                defaultValue={member?.note || ''}
                required={false}
                {...errorsToHelperTextObj(validationErrors.note)}
            />

            <Box display="flex" mt={2} justifyContent="end">
                <Button
                    disabled={isLoading}
                    onClick={() => handleClose()}
                    color="info">
                    Batal
                </Button>
                <Button
                    loading={isLoading}
                    type="submit"
                    color="info"
                    variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
