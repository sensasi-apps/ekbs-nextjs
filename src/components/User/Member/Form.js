import { useState } from 'react'
import { mutate } from 'swr'
import moment from 'moment'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import DatePicker from '../../DatePicker'
import axios from '@/lib/axios'
import LoadingCenter from '../../Statuses/LoadingCenter'

export default function MemberForm({
    isShow = true,
    uuid: userUuid,
    data: member,
    onClose,
    onSubmitted,
    ...props
}) {
    if (!isShow) return null

    const [joinedAt, setJoinedAt] = useState(
        member?.joined_at ? moment(member?.joined_at) : null,
    )

    const [unjoinedAt, setUnjoinedAt] = useState(
        member?.unjoined_at ? moment(member?.unjoined_at) : null,
    )

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleJoinedAtChange = value => {
        setJoinedAt(value)
        setErrors({
            ...errors,
            joined_at: null,
        })
    }

    const handleUnjoinedAtChange = value => {
        setUnjoinedAt(value)
        setErrors({
            ...errors,
            unjoined_at: null,
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target)

            if (joinedAt) {
                formData.set('joined_at', joinedAt.format('YYYY-MM-DD'))
            }

            if (unjoinedAt) {
                formData.set('unjoined_at', unjoinedAt.format('YYYY-MM-DD'))
            }

            await axios.post(`/users/${userUuid}/member`, formData)
            mutate(`/users/${userUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error?.response?.data?.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

    if (isLoading) return <LoadingCenter />

    return (
        <form onSubmit={handleSubmit} {...props}>
            <DatePicker
                required
                fullWidth
                onChange={handleJoinedAtChange}
                label="Tanggal Bergabung"
                margin="normal"
                name="joined_at"
                defaultValue={member?.joined_at ? joinedAt : null}
                error={Boolean(errors.joined_at)}
                helperText={errors.joined_at}
            />

            <DatePicker
                fullWidth
                onChange={handleUnjoinedAtChange}
                label="Tanggal Berhenti/Keluar"
                margin="normal"
                name="unjoined_at"
                defaultValue={member?.unjoined_at ? unjoinedAt : null}
                error={Boolean(errors.unjoined_at)}
                helperText={errors.unjoined_at}
            />

            <TextField
                fullWidth
                multiline
                name="unjoined_reason"
                label="Alasan Berhenti/Keluar"
                margin="normal"
                defaultValue={member?.unjoined_reason || ''}
                error={Boolean(errors.unjoined_reason)}
                helperText={errors.unjoined_reason}
            />

            <TextField
                fullWidth
                multiline
                name="note"
                label="Catatan tambahan"
                margin="normal"
                defaultValue={member?.note || ''}
                error={Boolean(errors.note)}
                helperText={errors.note}
            />

            <Box display="flex" mt={2} justifyContent="end">
                <Button onClick={() => onClose()}>Batal</Button>
                <Button type="submit">Simpan</Button>
            </Box>
        </form>
    )
}
