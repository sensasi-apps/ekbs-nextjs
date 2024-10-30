import { FormValuesType } from './form-values-type'

export interface FormikStatusType {
    isDisabled: boolean
    isFormOpen: boolean
    submittedData?: Required<FormValuesType> & {
        no?: FormValuesType['no']
    }
}
