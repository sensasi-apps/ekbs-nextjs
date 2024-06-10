// types
import type { AxiosError } from 'axios'
import type Role from '@/dataTypes/Role'
import type FormType from '@/components/Global/Form/type'
import type ValidationErrorsType from '@/types/ValidationErrors'
// vendors
import { stringify } from 'qs'
import axios from '@/lib/axios'
import Masonry from '@mui/lab/Masonry'
import useSWR from 'swr'
// materials
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
// components
import useValidationErrors from '@/hooks/useValidationErrors'
import Skeletons from '@/components/Global/Skeletons'

export default function RoleForm({
    data: { id, name_id, group, permissions: rolePermissions },
    loading,
    actionsSlot,
    onSubmitted,
    setSubmitting,
}: FormType<Role>) {
    const { validationErrors, setValidationErrors } = useValidationErrors()

    const { data: permissions = [], isLoading } = useSWR('/data/permissions')

    const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()

        if (loading) return

        const formEl = ev.currentTarget
        if (!formEl.checkValidity()) return

        setSubmitting(true)

        const formData = new FormData(formEl)
        const payload = Object.fromEntries(formData.entries())

        axios
            .put(`/roles/${id}`, stringify(payload))
            .then(() => onSubmitted())
            .catch(
                (
                    err: AxiosError<{
                        errors?: ValidationErrorsType
                        message?: string
                    }>,
                ) => {
                    if (err.response?.status !== 422) {
                        throw err
                    }

                    if (err.response?.data.errors) {
                        setValidationErrors(err.response.data.errors)
                    }
                },
            )
            .finally(() => {
                setSubmitting(false)
            })
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
                disabled={loading}
                name="name_id"
                label="name_id"
                margin="dense"
                defaultValue={name_id}
                fullWidth
                required
                error={!!validationErrors?.name_id}
                helperText={validationErrors?.name_id}
            />

            <TextField
                disabled={loading}
                name="group"
                label="group"
                margin="dense"
                defaultValue={group}
                fullWidth
                required
                error={!!validationErrors?.group}
                helperText={validationErrors?.group}
            />

            {isLoading && <Skeletons />}

            {!isLoading && (
                <FormControl
                    disabled={loading}
                    margin="dense"
                    component="fieldset"
                    error={Boolean(validationErrors.permissionNames)}>
                    <FormLabel component="legend">
                        Assign responsibility
                    </FormLabel>
                    <FormGroup>
                        <Masonry>
                            {permissions?.map(
                                ({ name }: { name: string }, i: number) => (
                                    <FormControlLabel
                                        key={i}
                                        control={
                                            <Checkbox
                                                defaultChecked={
                                                    rolePermissions?.findIndex(
                                                        permission =>
                                                            permission.name ===
                                                            name,
                                                    ) !== -1
                                                }
                                                value={name}
                                                name={`permissionNames[${i}]`}
                                            />
                                        }
                                        label={name}
                                    />
                                ),
                            )}
                        </Masonry>
                    </FormGroup>
                    <FormHelperText>
                        {validationErrors.permissionNames}
                    </FormHelperText>

                    {actionsSlot}
                </FormControl>
            )}
        </form>
    )
}
