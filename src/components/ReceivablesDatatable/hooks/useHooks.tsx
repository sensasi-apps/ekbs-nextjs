import type { FormValuesType } from '../PaymentForm'
import type { Installment } from '@/dataTypes/Installment'
// vendors
import { useRouter } from 'next/router'
import { useState } from 'react'

export function useHooks() {
    const {
        query: { type, state },
    } = useRouter()

    const [formikProps, setFormikProps] = useState<{
        values: FormValuesType
        status: Installment
    }>()

    return {
        formikProps,
        type,
        state,
        setFormikProps,
        closeFormDialog: () => setFormikProps(undefined),
    }
}
