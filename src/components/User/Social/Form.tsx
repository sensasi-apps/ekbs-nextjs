// types
import type { UUID } from 'crypto'
import type { FormEvent } from 'react'
import { type ValidationErrorsType } from '@/types/ValidationErrors'
// vendors
import axios from '@/lib/axios'
import { mutate } from 'swr'
import { PatternFormat } from 'react-number-format'
import { useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/GridLegacy'
// components
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextField from '@/components/TextField'
// utils
import handle422 from '@/utils/errorCatcher'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

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
    const [errors, setErrors] = useState<ValidationErrorsType>({})
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
            style={{
                marginTop: '1rem',
            }}
            onSubmit={handleSubmit}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <SelectFromApi
                        endpoint="/data/socials"
                        selectProps={{
                            required: true,
                            fullWidth: true,
                            size: 'small',
                            defaultValue: 1,
                            name: 'social_id',
                        }}
                        onValueChange={social => {
                            setSocialId(social?.id ?? 1)
                            setErrors({
                                ...errors,
                                social_id: [],
                            })
                        }}
                        {...errorsToHelperTextObj(errors.social_id)}
                    />
                </Grid>

                <Grid item xs={8}>
                    <InputComponent
                        socialId={socialId}
                        errors={errors}
                        setErrors={setErrors}
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

function InputComponent({
    socialId,
    errors,
    setErrors,
}: {
    socialId: number
    errors: ValidationErrorsType
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrorsType>>
}) {
    if ([1, 3].includes(socialId)) {
        return (
            <PatternFormat
                customInput={TextField}
                name="username"
                autoComplete="off"
                margin="none"
                format="##  ###–####–####"
                onChange={() =>
                    setErrors(prev => ({
                        ...prev,
                        username: [],
                    }))
                }
                // pattern=""

                error={Boolean(errors.username)}
                helperText={errors.username}
                {...getNumericInputProps(socialId)}
            />
        )
    }

    return (
        <TextField
            name="username"
            autoComplete="off"
            margin="none"
            onChange={() =>
                setErrors({
                    ...errors,
                    username: [],
                })
            }
            error={Boolean(errors.username)}
            helperText={errors.username}
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
    }
}

function getNumericInputProps(socialId: number) {
    const phoneNoHelperText =
        'Awali dengan +62 untuk Indonesia, Contoh: +62 812-3456-7890'

    switch (socialId) {
        case 1:
            return {
                label: 'Nomor Telp/HP',
                helperText: phoneNoHelperText,
                InputProps: {
                    startAdornment: '+ ',
                },
            }

        case 3:
            return {
                label: 'Nomor WhatsApp',
                helperText: phoneNoHelperText,
                InputProps: {
                    startAdornment: '+ ',
                },
            }
    }
}
