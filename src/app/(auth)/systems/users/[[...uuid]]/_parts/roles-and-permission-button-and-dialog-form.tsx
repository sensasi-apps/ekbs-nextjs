// types
import type User from '@/features/user/types/user'
import type Role from '@/types/orms/role'
import type { FormEvent } from 'react'
// vendors
import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import MuiDialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
// components
import CompleteCenter from '@/components/Statuses/CompleteCenter'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import ErrorCenter from '@/components/Statuses/ErrorCenter'
// utils
import { getRoleIconByIdName } from '@/components/User/RoleChips'

export default function RolesAndPermissionButtonAndDialogForm({
    data: user = {} as User,
    isLoading: isDataLoading,
}: {
    data: User
    isLoading: boolean
}) {
    const [isOpen, setIsOpen] = useState(false)

    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const roles: string[] = []

        formData.forEach((value, key) =>
            key === 'roles' ? roles.push(value as string) : null,
        )

        setIsLoading(true)
        axios
            .put(`/users/${user.uuid}/set-roles`, {
                roles: roles,
            })
            .then(() => {
                mutate(`users/${user.uuid}`)
                setIsComplete(true)
                setIsLoading(false)
            })
            .catch(error => {
                setError(error.response?.data.message)
                setIsLoading(false)
            })
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
                                {ROLE_GROUPS.map(groupName => (
                                    <Box key={groupName}>
                                        <CheckboxesByGroupName
                                            groupName={groupName}
                                            user={user}
                                        />
                                    </Box>
                                ))}
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

function DialogTitle({
    isLoading,
    onClose,
}: {
    isLoading: boolean
    onClose: () => void
}) {
    return (
        <MuiDialogTitle display="flex" flexDirection="row" alignItems="center">
            <ManageAccountsIcon color="warning" />
            <Typography variant="h6" component="div" ml={1} flexGrow={1}>
                Pengaturan peran
            </Typography>

            <IconButton disabled={isLoading} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </MuiDialogTitle>
    )
}

function isDisabled(user: User, role: string): boolean {
    if (role === 'anggota' && user.member) {
        return true
    }

    if (role === 'karyawan' && user.employee) {
        return true
    }

    return false
}

const ROLE_GROUPS = [
    'basic',
    'palm bunch',
    'loan',
    'farm inputs',
    'heavy equipment rent',
    'finance',
    'inventory',
    'mart',
    'system',
    'repair shop',
    'clm',
]

const ROLE_GROUPS_ID: {
    [key: (typeof ROLE_GROUPS)[number]]: string
} = {
    basic: 'identifikasi dasar',
    finance: 'keuangan',
    loan: 'pinjaman',
    system: 'sistem',
    'palm bunch': 'TBS',
    'farm inputs': 'SAPRODI',
    inventory: 'inventaris',
    'heavy equipment rent': 'sewa alat berat',
    mart: 'Belayan Mart',
    'repair shop': 'Belayan Spare Parts',
    clm: 'Sertifikasi dan Pengelolaan Kebun',
}

function CheckboxesByGroupName({
    groupName,
    user,
}: {
    groupName: string
    user: User
}) {
    const { data: roles = [], isLoading } = useSWR<Role[]>('/data/roles')

    return (
        <>
            <Divider textAlign="left">
                <Typography variant="caption" color="primary">
                    {ROLE_GROUPS_ID[groupName]}
                </Typography>
            </Divider>

            <FormGroup row>
                {isLoading && (
                    <Skeleton
                        variant="rounded"
                        sx={{
                            width: '100%',
                            height: '2em',
                        }}
                    />
                )}

                {roles
                    .filter(role => role.group === groupName)
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
}
