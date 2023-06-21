import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import { Box, Button, Grid, TextField } from '@mui/material'

import SelectInputFromApi from '@/components/SelectInputFromApi'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

const GET_INPUT_PROPS = id => {
    switch (id) {
        case 2:
            return {
                label: 'Alamat email',
                type: 'email',
            }

        case 3:
            return {
                label: 'Nomor WhatsApp',
                helperText:
                    'Awali dengan +62 untuk Indonesia, Contoh: 6281234567890',
                type: 'number',
                InputProps: {
                    startAdornment: '+',
                },
            }

        case 4:
            return {
                label: 'URL Profil Facebook',
                InputProps: {
                    startAdornment: 'facebook.com/',
                },
            }

        case 5:
            return {
                label: 'Username Instagram',
                InputProps: {
                    startAdornment: '@',
                },
            }

        default:
            return {
                label: 'Nomor Telp/HP',
                helperText:
                    'Awali dengan +62 untuk Indonesia, Contoh: 6281234567890',
                type: 'number',
                InputProps: {
                    startAdornment: '+',
                },
            }
    }
}

export default function SocialForm({
    isShow,
    onClose,
    onSubmitted,
    userUuid,
    ...props
}) {
    const [errors, setErrors] = useState({})
    const [socialId, setSocialId] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target)

            await axios.post(`/users/${userUuid}/socials`, formData)
            await mutate(`/users/${userUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }

            if (onClose) {
                onClose()
            }

            setSocialId(1)
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                console.log(err)
            }
        }

        setIsLoading(false)
    }

    if (!isShow) return null
    if (isLoading) return <LoadingCenter />

    return (
        <form
            style={{
                marginTop: '1rem',
            }}
            onSubmit={handleSubmit}
            autoComplete="off"
            {...props}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <SelectInputFromApi
                        endpoint="/select/socials"
                        name="social_id"
                        selectProps={{
                            defaultValue: 1,
                        }}
                        onChange={e => {
                            setSocialId(e.target.value)
                            setErrors({
                                ...errors,
                                social_id: null,
                            })
                        }}
                        error={Boolean(errors.social_id)}
                        helperText={errors.social_id}
                    />
                </Grid>

                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        required
                        name="username"
                        onChange={() =>
                            setErrors({
                                ...errors,
                                username: null,
                            })
                        }
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        {...GET_INPUT_PROPS(socialId)}
                    />
                </Grid>
            </Grid>

            <Box textAlign="right" mt={1}>
                <Button
                    onClick={() => {
                        setSocialId(1)
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>
                <Button type="submit">Simpan</Button>
            </Box>
        </form>
    )
}
