import { UUID } from 'crypto'
import {
    createContext,
    useContext,
    useReducer,
    FC,
    Reducer,
    PropsWithChildren,
} from 'react'

enum ReducerActionTypes {
    SetSubmitting = 'SET_SUBMITTING',
    SetDeleting = 'SET_DELETING',
    HandleClose = 'HANDLE_CLOSE',
    HandleEdit = 'HANDLE_EDIT',
    HandleCreate = 'HANDLE_CREATE',
}

type DefaultDataType = { id?: number; uuid?: UUID }

type StateType<T = DefaultDataType> = {
    data: T
    formOpen: boolean
    submitting: boolean
    deleting: boolean
}

type ReducerActionType<T = DefaultDataType> = {
    type: ReducerActionTypes
    payload?: T | boolean
}

type FormDataContextValueType<T = DefaultDataType> = StateType<T> & {
    isNew: boolean
    loading: boolean
    setSubmitting: (value: boolean) => void
    setDeleting: (value: boolean) => void
    handleClose: () => void
    handleEdit: (data: T) => void
    handleCreate: () => void
}

const { SetSubmitting, SetDeleting, HandleClose, HandleEdit, HandleCreate } =
    ReducerActionTypes

const initialState: StateType = {
    data: {},
    formOpen: false,
    submitting: false,
    deleting: false,
}

const reducer: Reducer<StateType, ReducerActionType> = (state, action) => {
    switch (action.type) {
        case SetSubmitting:
            return {
                ...state,
                submitting: action.payload as boolean,
            }
        case SetDeleting:
            return {
                ...state,
                deleting: action.payload as boolean,
            }
        case HandleClose:
            return {
                ...state,
                formOpen: false,
            }
        case HandleEdit:
            return {
                ...state,
                data: action.payload as DefaultDataType,
                formOpen: true,
            }
        case HandleCreate:
            return {
                ...state,
                data: {},
                formOpen: true,
            }
        default:
            return state
    }
}

const FormDataContext = createContext({} as FormDataContextValueType)

const FormDataProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const { uuid, id } = state.data

    const value: FormDataContextValueType = {
        ...state,
        loading: state.submitting || state.deleting,
        isNew: !(uuid || id),
        setSubmitting: (value: boolean) =>
            dispatch({
                type: SetSubmitting,
                payload: value,
            }),
        setDeleting: (value: boolean) =>
            dispatch({ type: SetDeleting, payload: value }),
        handleClose: () => dispatch({ type: HandleClose }),
        handleEdit: data => dispatch({ type: HandleEdit, payload: data }),
        handleCreate: () => dispatch({ type: HandleCreate }),
    }

    return (
        <FormDataContext.Provider value={value}>
            {children}
        </FormDataContext.Provider>
    )
}

const useFormData = () => useContext(FormDataContext)

export default useFormData
export { FormDataProvider }
