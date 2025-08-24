import type Land from '@/modules/clm/types/orms/land'

export default interface UserLandFormPropType {
    data: Land
    userUuid: string
    onCancel: () => void
    isLoading: boolean
    onSubmit: () => void
    setIsLoading: (isLoading: boolean) => void
}
