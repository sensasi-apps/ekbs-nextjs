import Masonry from '@mui/lab/Masonry'
// materials
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import type { AxiosError } from 'axios'
// vendors
import { stringify } from 'qs'
import useSWR from 'swr'
import type FormType from '@/components/Global/Form/type'
import Skeletons from '@/components/Global/Skeletons'
// components
import useValidationErrors from '@/hooks/useValidationErrors'
import axios from '@/lib/axios'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'
import type Role from '@/types/orms/role'

export default function RoleForm({
    data: { id, name_id, group, permissions: rolePermissions },
    loading,
    actionsSlot,
    onSubmitted,
    setSubmitting,
}: FormType<Role>) {
    const { validationErrors, setValidationErrors } = useValidationErrors()

    const { data: permissions = [], isLoading } =
        useSWR<
            {
                name: string
            }[]
        >('/data/permissions')

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
            .catch((err: AxiosError<LaravelValidationExceptionResponse>) => {
                if (err.response?.status !== 422) {
                    throw err
                }

                if (err.response?.data.errors) {
                    setValidationErrors(err.response.data.errors)
                }
            })
            .finally(() => {
                setSubmitting(false)
            })
    }

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <TextField
                defaultValue={name_id}
                disabled={loading}
                error={!!validationErrors?.name_id}
                fullWidth
                helperText={validationErrors?.name_id}
                label="name_id"
                margin="dense"
                name="name_id"
                required
            />

            <TextField
                defaultValue={group}
                disabled={loading}
                error={!!validationErrors?.group}
                fullWidth
                helperText={validationErrors?.group}
                label="group"
                margin="dense"
                name="group"
                required
            />

            {isLoading && <Skeletons />}

            {!isLoading && (
                <FormControl
                    component="fieldset"
                    disabled={loading}
                    error={Boolean(validationErrors.permissionNames)}
                    margin="dense">
                    <FormLabel component="legend">
                        Assign responsibility
                    </FormLabel>
                    <FormGroup>
                        <Masonry>
                            {permissions.map(({ name }, i) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={
                                                rolePermissions?.findIndex(
                                                    permission =>
                                                        permission.name ===
                                                        name,
                                                ) !== -1
                                            }
                                            name={`permissionNames[${i}]`}
                                            value={name}
                                        />
                                    }
                                    key={name}
                                    label={name}
                                />
                            ))}
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
