import { useSearchParams } from 'next/navigation'
// vendors
import { useState } from 'react'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import type { FormValuesType } from '../PaymentForm'

export function useHooks() {
    const searchParams = useSearchParams()

    const [formikProps, setFormikProps] = useState<{
        values: FormValuesType
        status: InstallmentORM
    }>()

    return {
        closeFormDialog: () => setFormikProps(undefined),
        formikProps,
        setFormikProps,
        state: searchParams?.get('state'),
        type: searchParams?.get('type'),
    }
}
