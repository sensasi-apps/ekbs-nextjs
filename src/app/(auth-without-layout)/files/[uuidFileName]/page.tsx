'use client'

import myAxios from '@/lib/axios'
import type { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

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
            title="PDF Viewer"
            style={{ width: '100%', height: '100svh' }}
        />
    )
}
