import { createContext, useContext, useState } from 'react'

/**
 * @typedef {Object} FormDataContextValue
 * @property {Object|undefined} data - The current data.
 * @property {boolean} isNew - Indicates whether the data is new (doesn't have uuid or id).
 * @property {boolean} isDataNotUndefined - Indicates whether the data is not undefined.
 * @property {function} handleClose - Function to close/reset the data.
 * @property {function} handleCreate - Function to create new data.
 * @property {function} handleEdit - Function to edit the existing data.
 */

/**
 * Context for managing form data.
 * @type {React.Context<FormDataContextValue>}
 */
const FormDataCtx = createContext()

/**
 * Provider component for managing form data.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactNode} The wrapped components.
 */
const FormDataProvider = ({ children }) => {
    const [data, setData] = useState()

    /**
     * Indicates whether the data is new.
     * @type {boolean}
     * @memberof FormDataContextValue
     */
    const isNew = !(data?.uuid || data?.id)

    /**
     * Indicates whether the data is not undefined.
     * @type {boolean}
     * @memberof FormDataContextValue
     */
    const isDataNotUndefined = data !== undefined

    /**
     * Function to close/reset the data.
     * @type {function}
     * @memberof FormDataContextValue
     */
    const handleClose = () => setData(undefined)

    /**
     * Function to create new data.
     * @param {Object} data - The data to be created.
     * @type {function}
     * @memberof FormDataContextValue
     */
    const handleCreate = data => {
        if (data) {
            return setData(data)
        } else {
            return setData({})
        }
    }

    /**
     * Function to edit the existing data.
     * @type {function}
     * @memberof FormDataContextValue
     * @param {Object} data - The data to be edited.
     */
    const handleEdit = data => setData(data)

    return (
        <FormDataCtx.Provider
            value={{
                data,
                isNew,
                isDataNotUndefined,
                handleClose,
                handleCreate,
                handleEdit,
            }}>
            {children}
        </FormDataCtx.Provider>
    )
}

/**
 * Hook for consuming form data context.
 * @returns {FormDataContextValue} Form data context values.
 */
const useFormData = () => useContext(FormDataCtx)

export default useFormData
export { FormDataProvider }
