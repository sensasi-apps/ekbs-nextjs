'use client'

import DownloadIcon from '@mui/icons-material/Download'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import { downloadFileFromApi } from '@/utils/download-file-from-api'

interface DownloadRequisiteLandFilesButtonProps {
    userUuid: string
    landUuid: string
    disabled?: boolean
    variant?: 'text' | 'outlined' | 'contained'
    size?: 'small' | 'medium' | 'large'
}

export default function DownloadRequisiteLandFilesButton({
    userUuid,
    landUuid,
    disabled = false,
    variant = 'outlined',
    size = 'small',
}: DownloadRequisiteLandFilesButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false)

    async function handleDownload() {
        setIsDownloading(true)
        try {
            await downloadFileFromApi(
                `/clm/members/${userUuid}/lands/${landUuid}/download-requisite-files`,
                `requisite-land-${landUuid}.zip`,
            )
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Button
            disabled={disabled || isDownloading}
            endIcon={
                isDownloading ? (
                    <CircularProgress size={16} />
                ) : (
                    <DownloadIcon />
                )
            }
            onClick={handleDownload}
            size={size}
            variant={variant}>
            {isDownloading ? 'Mengunduh...' : 'Unduh Berkas Syarat'}
        </Button>
    )
}
