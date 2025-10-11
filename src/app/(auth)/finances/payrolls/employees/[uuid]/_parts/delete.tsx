import FormHelperText from '@mui/material/FormHelperText'
// materials
import Tooltip from '@mui/material/Tooltip'
// vendors
import { useRouter } from 'next/navigation'
import { useState } from 'react'
// etc
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
import FormDeleteButton from '@/components/form/FormDeleteButton'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type Payroll from '@/types/orms/payroll'
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
            <Tooltip arrow placement="top" title="Batalkan Penggajian">
                <span>
                    <FormDeleteButton
                        disabled={disabled}
                        loading={loading}
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
                <FormHelperText component="div" error>
                    {Object.values(errors).map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </FormHelperText>
            )}
        </>
    )
}
