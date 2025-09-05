// vendors
import type { UUID } from 'crypto'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
//
import type UserType from '@/modules/user/types/orms/user'
import UserAutocomplete from '@/components/UserAutocomplete'
import handle422 from '@/utils/handle-422'
import FinanceApiUrlEnum from '../../../../_enums/api-url'

export default function PayrollUsersForm({
    payrollUuid,
    onClose,
}: {
    payrollUuid: UUID
    onClose: () => void
}) {
    const [users, setUsers] = useState<UserType[]>([])
    const [addEmployeeLoading, setAddEmployeeLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const disabled = submitLoading || addEmployeeLoading

    const handleAddAllEmployees = () => {
        setAddEmployeeLoading(true)

        return axios
            .get<UserType[]>('/users/employees')
            .then(res => {
                setUsers(res.data)
            })
            .finally(() => {
                setAddEmployeeLoading(false)
            })
    }

    const handleSubmit = () => {
        setSubmitLoading(true)

        return axios
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
                size="small"
                onClick={handleAddAllEmployees}
                disabled={disabled}
                loading={addEmployeeLoading}>
                Masukkan Semua Karyawan
            </Button>

            <Box mt={1}>
                <UserAutocomplete
                    multiple
                    showRole
                    showNickname
                    label="Daftar Pengguna"
                    disabled={disabled}
                    value={users}
                    onChange={(_, value) => setUsers(value)}
                />
            </Box>

            {errors?.users?.map((error, index) => (
                <Box key={index} color="error.main">
                    {error}
                </Box>
            ))}

            <Box mt={2} display="flex" justifyContent="end" gap={1}>
                <Button
                    size="small"
                    color="info"
                    onClick={onClose}
                    disabled={disabled}>
                    Batal
                </Button>

                <Button
                    size="small"
                    type="submit"
                    color="info"
                    variant="contained"
                    disabled={disabled}
                    loading={submitLoading}
                    onClick={handleSubmit}>
                    Tambahkan
                </Button>
            </Box>
        </>
    )
}
