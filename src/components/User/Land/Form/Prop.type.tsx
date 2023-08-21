import Land from '@/types/Land'

type UserLandFormPropType = {
    data: Land
    userUuid: string
    onCancel: () => void
    isLoading: boolean
    onSubmit: () => void
    setIsLoading: (isLoading: boolean) => void
}

export default UserLandFormPropType
