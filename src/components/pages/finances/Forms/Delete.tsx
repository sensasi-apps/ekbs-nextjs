import type Payroll from '@/dataTypes/Payroll'
// vendors
import { useRouter } from 'next/router'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Tooltip from '@mui/material/Tooltip'
import FormHelperText from '@mui/material/FormHelperText'
// etc
import FinanceApiUrlEnum from '../ApiUrlEnum'
import FormDeleteButton from '@/components/form/FormDeleteButton'
import LaravelValidationException from '@/types/LaravelValidationException'
import handle422 from '@/utils/errorCatcher'

export default function PayrollDeleteForm({
    uuid,
    disabled,
}: {
    uuid: Payroll['uuid']
    disabled: boolean
}) {
    const { back } = useRouter()
    const [errors, setErrors] = useState<LaravelValidationException['errors']>()
    const [loading, setLoading] = useState(false)

    return (
        <>
            <Tooltip title="Batalkan Penggajian" arrow placement="top">
                <span>
                    <FormDeleteButton
                        loading={loading}
                        disabled={disabled}
                        onClick={() => {
                            setLoading(true)
                            return axios
                                .delete(
                                    FinanceApiUrlEnum.DELETE_PAYROLL.replace(
                                        '$uuid',
                                        uuid,
                                    ),
                                )
                                .then(() => back())
                                .catch(err => {
                                    handle422(err, setErrors)
                                    setLoading(false)
                                })
                        }}
                    />
                </span>
            </Tooltip>

            {errors && (
                <FormHelperText error component="div">
                    {Object.values(errors).map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </FormHelperText>
            )}
        </>
    )
}
