import { FC } from 'react'

import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'

import FormType from '@/components/Global/Form/Form.type'
import Role from '@/dataTypes/Role'
import useValidationErrors from '@/hooks/useValidationErrors'
import axios from '@/lib/axios'
import useSWR from 'swr'
import Skeletons from '@/components/Global/Skeletons'
import { Masonry } from '@mui/lab'
import QueryString from 'qs'

const RoleForm: FC<FormType<Role>> = ({
    data: { id, name_id, group, permissions: rolePermissions } = {},
    loading,
    actionsSlot,
    handleClose,
    setSubmitting,
}) => {
    const { validationErrors, setValidationErrors } = useValidationErrors()

    const { data: permissions = [], isLoading } = useSWR(
        '/data/permissions',
        url => axios.get(url).then(res => res.data),
        {
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
        },
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (loading) return

        const formEl = e.currentTarget
        if (!formEl.checkValidity()) return

        setSubmitting(true)

        try {
            const formData = new FormData(formEl)
            const payload = Object.fromEntries(formData.entries())

            await axios.put(`/roles/${id}`, QueryString.stringify(payload))

            handleClose()
        } catch (error: any) {
            setSubmitting(false)

            if (error.response.status !== 422) {
                throw error
            }

            setValidationErrors(error.response.data.errors)
        }
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

export default RoleForm
