import PropTypes from 'prop-types'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'

import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle as MuiDialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    Typography,
    Tooltip,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

import CompleteCenter from '@/components/Statuses/CompleteCenter'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import ErrorCenter from '@/components/Statuses/ErrorCenter'
import __ from '@/locales/__'
import { memo } from 'react'
import { getRoleIconByIdName } from '../RoleChips'

const DialogTitle = ({ isLoading, onClose }) => (
    <MuiDialogTitle
        display="flex"
        flexDirection="row"
        alignItems="center"
        typography={false}>
        <ManageAccountsIcon color="warning" />
        <Typography variant="h6" component="div" ml={1} flexGrow={1}>
            Pengaturan peran
        </Typography>

        <IconButton disabled={isLoading} onClick={onClose}>
            <CloseIcon />
        </IconButton>
    </MuiDialogTitle>
)

DialogTitle.propTypes = {
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}

const isDisabled = (user, role) => {
    if (role === 'anggota' && user.member) {
        return true
    }

    if (role === 'karyawan' && user.employee) {
        return true
    }

    return false
}

const RolesAndPermissionButtonAndDialogForm = ({
    data: user = {},
    isLoading: isDataLoading,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const { data: roles } = useSWR(
        '/data/roles',
        url =>
            axios.get(url).then(response => response.data?.map(role => role)),
        {
            revalidateOnFocus: false,
        },
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
            await mutate(`/users/${user.uuid}`)

            setIsComplete(true)
        } catch (error) {
            setError(error.response?.data.message)
        }

        setIsLoading(false)
    }

    const handleClose = () => {
        setIsOpen(false)
        setIsComplete(false)
        setIsLoading(false)
        setError(undefined)
    }

    const checkboxesByGroupName = groupName => (
        <>
            <Divider textAlign="left">
                <Typography variant="caption" color="primary">
                    {__(groupName, 'role-group-names')}
                </Typography>
            </Divider>
            <FormGroup row>
                {roles
                    ?.filter(role => role.group === groupName)
                    .map(role => (
                        <Tooltip
                            arrow={true}
                            key={role.id}
                            disableHoverListener={
                                !isDisabled(user, role.name_id)
                            }
                            title="Tidak dapat mengatur peran, silakan mengaturnya melalui tanggal bergabung / keluar"
                            placement="top">
                            <FormControlLabel
                                label={role.name_id}
                                disabled={isDisabled(user, role.name_id)}
                                control={
                                    <Checkbox
                                        checkedIcon={getRoleIconByIdName(
                                            role.name_id,
                                        )}
                                        name="roles"
                                        value={role.name}
                                        color="warning"
                                        defaultChecked={
                                            user.role_names_id?.includes(
                                                role.name_id,
                                            ) || false
                                        }
                                    />
                                }
                            />
                        </Tooltip>
                    ))}
            </FormGroup>
        </>
    )

    return (
        <>
            <Button
                disabled={!user.uuid || isDataLoading}
                color="warning"
                size="small"
                startIcon={<ManageAccountsIcon />}
                onClick={() => setIsOpen(true)}>
                Atur Peran
            </Button>

            {user.uuid && (
                <Dialog fullWidth maxWidth="xs" open={isOpen}>
                    <DialogTitle isLoading={isLoading} onClose={handleClose} />

                    <DialogContent>
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

                        {!(isComplete || isLoading || error) && (
                            <Box
                                display="flex"
                                flexDirection="column"
                                gap={3}
                                component="form"
                                id="set_roles_and_permission"
                                onSubmit={handleSubmit}
                                textTransform="capitalize">
                                {['basic', 'finance', 'loan', 'system'].map(
                                    groupName => (
                                        <Box key={groupName}>
                                            {checkboxesByGroupName(groupName)}
                                        </Box>
                                    ),
                                )}
                            </Box>
                        )}
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

RolesAndPermissionButtonAndDialogForm.propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
}

export default memo(RolesAndPermissionButtonAndDialogForm)
