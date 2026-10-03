'use client'

// vendors
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PurchaseFormDialog from '@/app/(auth)/repair-shop/spare-part-purchases/_parts/component/purchase-form-dialog'
import Endpoint from '@/app/(auth)/repair-shop/spare-part-purchases/_parts/enums/endpoint'
// components
import LoadingCenter from '@/components/loading-center'
// libs
import myAxios from '@/lib/axios'
// features
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'

export default function Page() {
    const { back, replace } = useRouter()
    const params = useParams()
    const uuid = params?.uuid

    const [data, setData] = useState<SparePartMovement>()

    useEffect(() => {
        if (uuid) {
            myAxios
                .get<SparePartMovement>(
                    Endpoint.READ.replace('$1', (uuid as string) ?? ''),
                )
                .then(res => {
                    setData(res.data)
                })
        }
    }, [uuid])

    if (!data) return <LoadingCenter />

    return (
        <PurchaseFormDialog
            formData={data}
            handleClose={() => {
                back()
            }}
            onDeleted={() => replace('/repair-shop/spare-part-purchases')}
        />
    )
}
