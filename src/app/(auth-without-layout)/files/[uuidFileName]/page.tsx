'use client'

import type { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import myAxios from '@/lib/axios'

export default function Page() {
    const { uuidFileName } = useParams<{ uuidFileName: string }>()
    const [objectUrl, setObjectUrl] = useState<string>()

    useEffect(() => {
        if (!objectUrl) {
            myAxios
                .get<Blob>(`file/${uuidFileName}`, {
                    responseType: 'blob',
                })
                .then(({ data }) => {
                    setObjectUrl(URL.createObjectURL(data))
                })
                .catch(({ status }: AxiosError) => {
                    if (status === 422) {
                        enqueueSnackbar('Gagal memuat berkas', {
                            variant: 'error',
                        })
                    }
                })
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [uuidFileName, objectUrl])

    return (
        <iframe
            src={objectUrl}
            style={{ height: '100svh', width: '100%' }}
            title="PDF Viewer"
        />
    )
}
