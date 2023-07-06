'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

import CompleteCenter from '@/components/Statuses/CompleteCenter'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import ErrorCenter from '@/components/Statuses/ErrorCenter'

export default function RolesAndPermissionButtonAndDialogForm({
    data: user = {},
    isLoading: isDataLoading,
}) {
    const [isOpen, setIsOpen] = useState(false)

    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const { data: roles } = useSWR('/data/roles', url =>
        axios.get(url).then(response => response.data),
    )

    const handleSubmit = async e => {
        e.preventDefault()

        setIsLoading(true)

        try {
            const formData = new FormData(e.target)
            const roles = []

            formData.forEach((value, key) =>
                key === 'roles' ? roles.push(value) : null,
            )

            await axios.put(`/users/${user.uuid}/set-roles`, { roles: roles })
            await mutate(`users/${user.uuid}`)

            setIsComplete(true)
        } catch (error) {
            setError(error.response?.data.message)
            throw error
        }

        setIsLoading(false)
    }

    function handleClose() {
        setIsOpen(false)
        setIsComplete(false)
        setIsLoading(false)
        setError(undefined)
    }

    return (
        <>
            <Button
                disabled={
                    !user.uuid || isDataLoading || user.is_active === false
                }
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setIsOpen(true)}>
                Hak akses
            </Button>

            {!isDataLoading && (
                <Dialog
                    fullWidth
                    maxWidth="xs"
                    open={isOpen}
                    onKeyDown={e => e.key === 'Escape' && setIsOpen(false)}>
                    <DialogContent>
                        <Box display="flex" mb={1.5} alignItems="center">
                            <ManageAccountsIcon color="warning" />
                            <Typography
                                variant="h6"
                                component="h2"
                                ml={1}
                                flexGrow={1}>
                                Pengaturan hak akses
                            </Typography>

                            <IconButton
                                disabled={isLoading}
                                onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <CompleteCenter
                            isShow={isComplete}
                            message={`Hak akses ${user.name} berhasil diubah`}
                        />

                        <LoadingCenter isShow={isLoading} />

                        <ErrorCenter
                            isShow={Boolean(error)}
                            message={error}
                            onClose={() => setError(undefined)}
                        />

                        <Box
                            sx={{
                                display:
                                    isComplete || isLoading || error
                                        ? 'none'
                                        : 'block',
                            }}>
                            <form
                                id="set_roles_and_permission"
                                onSubmit={handleSubmit}>
                                <FormControl
                                    sx={{ mx: 3 }}
                                    component="fieldset"
                                    variant="standard">
                                    <FormLabel component="legend">
                                        Hak Akses
                                    </FormLabel>
                                    <FormGroup>
                                        {roles?.map(role => (
                                            <div key={role.id}>
                                                <FormControlLabel
                                                    label={role.name}
                                                    control={
                                                        <>
                                                            <Checkbox
                                                                name="roles"
                                                                value={
                                                                    role.name
                                                                }
                                                                defaultChecked={user.role_names?.includes(
                                                                    role.name,
                                                                )}
                                                            />
                                                        </>
                                                    }
                                                />
                                                <FormHelperText>
                                                    {role.permissions
                                                        .map(perm => perm.name)
                                                        .join(', ')}
                                                </FormHelperText>
                                            </div>
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </form>
                        </Box>
                    </DialogContent>

                    {!isComplete && (
                        <DialogActions>
                            <Button
                                color="info"
                                disabled={isLoading}
                                type="reset"
                                onClick={handleClose}>
                                Batal
                            </Button>
                            <Button
                                color="info"
                                disabled={isLoading}
                                variant="contained"
                                form="set_roles_and_permission"
                                type="submit">
                                Simpan
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>
            )}
        </>
    )
}
