'use client'

// vendors
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
// components
import LoadingCenter from '@/components/loading-center'
// modules
import SaleFormDialog from '@/app/(auth)/repair-shop/sales/_parts/components/sale-form-dialog'
import type SaleFormValues from '@/modules/repair-shop/types/sale-form-values'

export default function Page() {
    const { back } = useRouter()
    const param = useParams()

    const { data } = useSWR<
        SaleFormValues & {
            finished_at: string
        }
    >(param?.uuid ? 'repair-shop/sales/' + (param.uuid as string) : null)

    if (!data) return <LoadingCenter />

    const isFinished = Boolean(data.finished_at)

    return (
        <SaleFormDialog
            formData={{ ...data, is_finished: true }}
            status={{
                isDisabled: isFinished || true,
            }}
            handleClose={() => {
                back()
            }}
        />
    )
}
