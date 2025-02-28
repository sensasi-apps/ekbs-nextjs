import type { ReactNode } from 'react'

export default interface FormType<T> {
    actionsSlot: ReactNode
    data: T
    loading: boolean
    onSubmitted: (data?: T) => void
    onChange?: (data: T) => void
    setSubmitting: (loading: boolean) => void
}
