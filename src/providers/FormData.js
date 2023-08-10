import { createContext, useContext, useState } from 'react'

const FormDataCtx = createContext()

const FormDataProvider = ({ children }) => {
    const [data, setData] = useState()

    const isNew = !(data?.uuid || data?.id)
    const isDataNotUndefined = data !== undefined
    const handleClose = () => setData(undefined)
    const handleCreate = () => setData({})
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

export { FormDataProvider }

const useFormData = () => useContext(FormDataCtx)

export default useFormData
