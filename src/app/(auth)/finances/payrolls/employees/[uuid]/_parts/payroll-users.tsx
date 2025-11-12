// vendors

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { UUID } from 'crypto'
import { useState } from 'react'
import UserAutocomplete from '@/components/user-autocomplete'
import axios from '@/lib/axios'
import type MinimalUser from '@/modules/user/types/minimal-user'
//
import type UserType from '@/modules/user/types/orms/user'
import handle422 from '@/utils/handle-422'
import FinanceApiUrlEnum from '../../../../_enums/api-url'

export default function PayrollUsersForm({
    payrollUuid,
    onClose,
}: {
    payrollUuid: UUID
    onClose: () => void
}) {
    const [users, setUsers] = useState<MinimalUser[]>([])
    const [addEmployeeLoading, setAddEmployeeLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const disabled = submitLoading || addEmployeeLoading

    function handleAddAllEmployees() {
        setAddEmployeeLoading(true)

        axios
            .get<UserType[]>('/users/employees')
            .then(res => {
                setUsers(res.data)
            })
            .finally(() => {
                setAddEmployeeLoading(false)
            })
    }

    function handleSubmit() {
        setSubmitLoading(true)

        axios
            .post(
                FinanceApiUrlEnum.CREATE_PAYROLL_USERS.replace(
                    '$uuid',
                    payrollUuid,
                ),
                {
                    user_uuids: users.map(user => user.uuid),
                },
            )
            .then(() => {
                onClose()
            })
            .catch(err => handle422(err, setErrors))
            .finally(() => {
                setSubmitLoading(false)
            })
    }

    return (
        <>
            <Button
                disabled={disabled}
                loading={addEmployeeLoading}
                onClick={handleAddAllEmployees}
                size="small">
                Masukkan Semua Karyawan
            </Button>

            <Box mt={1}>
                <UserAutocomplete
                    disabled={disabled}
                    label="Daftar Pengguna"
                    multiple
                    onChange={(_, value) => setUsers(value)}
                    value={users}
                />
            </Box>

            {errors?.users?.map(error => (
                <Box color="error.main" key={error}>
                    {error}
                </Box>
            ))}

            <Box display="flex" gap={1} justifyContent="end" mt={2}>
                <Button
                    color="info"
                    disabled={disabled}
                    onClick={onClose}
                    size="small">
                    Batal
                </Button>

                <Button
                    color="info"
                    disabled={disabled}
                    loading={submitLoading}
                    onClick={handleSubmit}
                    size="small"
                    type="submit"
                    variant="contained">
                    Tambahkan
                </Button>
            </Box>
        </>
    )
}
