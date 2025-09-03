import type Payroll from '@/types/orms/payroll'
// vendors
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Tooltip from '@mui/material/Tooltip'
import FormHelperText from '@mui/material/FormHelperText'
// etc
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
import FormDeleteButton from '@/components/form/FormDeleteButton'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import handle422 from '@/utils/handle-422'

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
