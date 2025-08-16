import type { FormValuesType } from '../PaymentForm'
import type { Installment } from '@/dataTypes/Installment'
import { useSearchParams } from 'next/navigation'
// vendors
import { useState } from 'react'

export function useHooks() {
    const searchParams = useSearchParams()

    const [formikProps, setFormikProps] = useState<{
        values: FormValuesType
        status: Installment
    }>()

    return {
        formikProps,
        type: searchParams?.get('type'),
        state: searchParams?.get('state'),
        setFormikProps,
        closeFormDialog: () => setFormikProps(undefined),
    }
}
