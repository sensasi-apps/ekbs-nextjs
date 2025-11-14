// types

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/GridLegacy'
import type { UUID } from 'crypto'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { mutate } from 'swr'
import SelectFromApi from '@/components/Global/SelectFromApi'
// components
import LoadingCenter from '@/components/statuses/loading-center'
import TextField from '@/components/TextField'
// vendors
import axios from '@/lib/axios'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import handle422 from '@/utils/handle-422'

export default function SocialForm({
    isShow,
    onClose,
    onSubmitted,
    userUuid,
}: {
    isShow: boolean
    onClose?: () => void
    onSubmitted?: () => void
    userUuid: UUID
}) {
    const [errors, setErrors] = useState<
        LaravelValidationExceptionResponse['errors']
    >({})
    const [socialId, setSocialId] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    if (!isShow) return null
    if (isLoading) return <LoadingCenter />

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        return axios
            .post(`/users/${userUuid}/socials`, formData)
            .then(() => {
                mutate(`users/${userUuid}`)
                if (onSubmitted) {
                    onSubmitted()
                }

                if (onClose) {
                    onClose()
                }

                setSocialId(1)
            })
            .catch(err => handle422(err, setErrors))
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                marginTop: '1rem',
            }}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <SelectFromApi
                        endpoint="/data/socials"
                        onValueChange={social => {
                            setSocialId(social?.id ?? 1)
                            setErrors({
                                ...errors,
                                social_id: [],
                            })
                        }}
                        selectProps={{
                            defaultValue: 1,
                            fullWidth: true,
                            name: 'social_id',
                            required: true,
                            size: 'small',
                        }}
                        {...errorsToHelperTextObj(errors.social_id)}
                    />
                </Grid>

                <Grid item xs={8}>
                    <InputComponent
                        errors={errors}
                        setErrors={setErrors}
                        socialId={socialId}
                    />
                </Grid>
            </Grid>

            <Box mt={1} textAlign="right">
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

function InputComponent({
    socialId,
    errors,
    setErrors,
}: {
    socialId: number
    errors: LaravelValidationExceptionResponse['errors']
    setErrors: React.Dispatch<
        React.SetStateAction<LaravelValidationExceptionResponse['errors']>
    >
}) {
    if ([1, 3].includes(socialId)) {
        return (
            <PatternFormat
                autoComplete="off"
                customInput={TextField}
                error={Boolean(errors.username)}
                format="##  ###–####–####"
                helperText={errors.username}
                margin="none"
                // pattern=""

                name="username"
                onChange={() =>
                    setErrors(prev => ({
                        ...prev,
                        username: [],
                    }))
                }
                {...getNumericInputProps(socialId)}
            />
        )
    }

    return (
        <TextField
            autoComplete="off"
            error={Boolean(errors.username)}
            helperText={errors.username}
            margin="none"
            name="username"
            onChange={() =>
                setErrors({
                    ...errors,
                    username: [],
                })
            }
            {...getTextInputProps(socialId)}
        />
    )
}

function getTextInputProps(socialId: number) {
    switch (socialId) {
        case 2:
            return {
                label: 'Alamat email',
                type: 'email',
            }

        case 4:
            return {
                InputProps: {
                    startAdornment: 'facebook.com/',
                },
                label: 'URL Profil Facebook',
            }

        case 5:
            return {
                InputProps: {
                    startAdornment: '@',
                },
                label: 'Username Instagram',
            }
    }
}

function getNumericInputProps(socialId: number) {
    const phoneNoHelperText =
        'Awali dengan +62 untuk Indonesia, Contoh: +62 812-3456-7890'

    switch (socialId) {
        case 1:
            return {
                helperText: phoneNoHelperText,
                InputProps: {
                    startAdornment: '+ ',
                },
                label: 'Nomor Telp/HP',
            }

        case 3:
            return {
                helperText: phoneNoHelperText,
                InputProps: {
                    startAdornment: '+ ',
                },
                label: 'Nomor WhatsApp',
            }
    }
}
