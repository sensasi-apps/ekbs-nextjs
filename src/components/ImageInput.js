import { useEffect, useState } from 'react'

import {
    Box,
    Button,
    Typography,
    FormControl,
    FormHelperText,
} from '@mui/material'

import ImageIcon from '@mui/icons-material/Image'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

const IMG_STYLE = {
    maxHeight: '320px',
    maxWidth: '100%',
}

export default function ImageInput({
    name,
    label,
    onChange,
    defaultValue,
    error,
    helperText,
    disabled,
    ...props
}) {
    const [isCaptureSupported, setIsCaptureSupported] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImagePreview, setSelectedImagePreview] = useState(null)

    useEffect(() => {
        const input = document.createElement('input')
        setIsCaptureSupported('capture' in input)
    }, [])

    const handleImageChange = event => {
        const file = event.target.files[0]

        if (file) {
            setSelectedImage(file)
        }

        if (onChange) {
            onChange(event)
        }
    }

    useEffect(() => {
        if (selectedImage) {
            setSelectedImagePreview(URL.createObjectURL(selectedImage))
        } else {
            setSelectedImagePreview(null)
        }
    }, [selectedImage])

    return (
        <Box {...props}>
            {label && <Typography variant="subtitle2">{label}</Typography>}

            {defaultValue && !selectedImagePreview && (
                <img style={IMG_STYLE} src={defaultValue} alt="Preview" />
            )}

            {selectedImagePreview && (
                <img
                    style={IMG_STYLE}
                    src={selectedImagePreview}
                    alt="Preview"
                />
            )}

            <FormControl fullWidth error={error}>
                <Box display="flex" justifyContent="space-between">
                    <Box display="flex" gap={2}>
                        <Button
                            component="label"
                            size="small"
                            disabled={disabled}
                            startIcon={<ImageIcon />}>
                            {defaultValue || selectedImagePreview
                                ? 'Ganti Pilihan'
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
                                disabled={disabled}
                                startIcon={<CameraAltIcon />}>
                                Buka Kamera
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    capture="user"
                                    name={name + '_capture'}
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: selectedImage ? 'flex' : 'none',
                        }}>
                        <Button
                            type="button"
                            onClick={() => setSelectedImage(null)}>
                            Batal
                        </Button>
                    </Box>
                </Box>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </Box>
    )
}
