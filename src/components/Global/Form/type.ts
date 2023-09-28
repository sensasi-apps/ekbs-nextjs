import type { ReactNode } from 'react'

interface FormType<T> {
    actionsSlot: ReactNode
    data: T
    loading: boolean
    onSubmitted: (data?: T) => void
    onChange?: (data: T) => void
    setSubmitting: (loading: boolean) => void
}

export default FormType
