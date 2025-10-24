import type { SubmittedData } from './submitted-data'

export interface FormikStatusType {
    isDisabled: boolean
    isFormOpen: boolean
    submittedData?: SubmittedData
}
