import type Land from '@/types/Land'

export default interface UserLandFormPropType {
    data: Land
    userUuid: string
    onCancel: () => void
    isLoading: boolean
    onSubmit: () => void
    setIsLoading: (isLoading: boolean) => void
}
