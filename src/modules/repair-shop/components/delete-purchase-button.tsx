'use client'

import DeleteRepairShopRecordButton, {
    type DeleteRepairShopRecordButtonProps,
} from './delete-repair-shop-record-button'

export default function DeletePurchaseButton({
    purchaseUuid,
    ...props
}: Omit<DeleteRepairShopRecordButtonProps, 'recordUuid' | 'kind'> & {
    purchaseUuid: string
}) {
    return (
        <DeleteRepairShopRecordButton
            {...props}
            kind="purchase"
            recordUuid={purchaseUuid}
        />
    )
}
