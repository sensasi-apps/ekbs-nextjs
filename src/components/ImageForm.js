'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import ImageIcon from '@mui/icons-material/Image'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

import axios from '@/lib/axios'
import LoadingCenter from './Statuses/LoadingCenter'

const IMG_STYLE = {
    maxHeight: '320px',
    maxWidth: '100%',
}

export default function ImageInput({
    defaultValue,
    action,
    name,
    onSubmitted,
    label,
    ...props
}) {
    const [isCaptureSupported, setIsCaptureSupported] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImagePreview, setSelectedImagePreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const input = document.createElement('input')
        setIsCaptureSupported('capture' in input)
    }, [])

    const handleImageChange = event => {
        const file = event.target.files[0]

        if (file) {
            setSelectedImage(file)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target)

        await axios.post(action, formData)
        setSelectedImage(null)

        setIsLoading(false)

        if (onSubmitted) {
            await onSubmitted()
        }
    }

    useEffect(() => {
        if (selectedImage) {
            setSelectedImagePreview(URL.createObjectURL(selectedImage))
        } else {
            setSelectedImagePreview(null)
        }
    }, [selectedImage])

    if (isLoading) return <LoadingCenter />

    return (
        <form onSubmit={handleSubmit} {...props}>
            <Box>
                {label && <Typography variant="subtitle2">{label}</Typography>}

                {selectedImagePreview && (
                    <img
                        style={IMG_STYLE}
                        src={selectedImagePreview}
                        alt="Preview"
                    />
                )}

                {defaultValue && !selectedImagePreview && (
                    <img style={IMG_STYLE} src={defaultValue} alt="Preview" />
                )}

                <Box display="flex" justifyContent="space-between">
                    <Box display="flex" gap={2}>
                        <Button
                            component="label"
                            size="small"
                            startIcon={<ImageIcon />}>
                            {defaultValue || selectedImagePreview
                                ? 'Ganti gambar'
                                : 'Pilih file'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                name={name}
                                onChange={handleImageChange}
                            />
                        </Button>

                        {isCaptureSupported && (
                            <Button
                                component="label"
                                size="small"
                                startIcon={<CameraAltIcon />}>
                                Buka Kamera
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    capture="user"
                                    name={name}
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}
                    </Box>

                    {selectedImage && (
                        <Box display="flex">
                            <Button
                                type="button"
                                onClick={() => setSelectedImage(null)}>
                                Batal
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </form>
    )
}
