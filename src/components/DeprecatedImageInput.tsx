import type { BoxProps } from '@mui/material/Box'
import type { ChangeEventHandler } from 'react'
import type { ImageProps } from 'next/image'
// vendors
import { useEffect, useState } from 'react'
import Image from 'next/image'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
// icons
import ImageIcon from '@mui/icons-material/Image'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

export default function DeprecatedImageInput({
    name,
    label,
    onChange,
    defaultValue,
    error,
    helperText,
    disabled,
    ...props
}: Omit<BoxProps, 'onChange' | 'defaultValue'> & {
    name: string
    onChange?: ChangeEventHandler<HTMLInputElement>
    defaultValue?: ImageProps['src']
    label?: string
    error?: boolean
    helperText?: string | string[]
    disabled?: boolean
}) {
    const [isCaptureSupported, setIsCaptureSupported] = useState(true)
    const [selectedImage, setSelectedImage] = useState<File>()
    const [selectedImagePreview, setSelectedImagePreview] = useState<string>()

    useEffect(() => {
        const input = document.createElement('input')
        setIsCaptureSupported('capture' in input)
    }, [])

    const handleImageChange: ChangeEventHandler<HTMLInputElement> = event => {
        const { files } = event.target
        const file = files ? files[0] : undefined

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
            setSelectedImagePreview(undefined)
        }
    }, [selectedImage])

    return (
        <Box {...props}>
            {label && <Typography variant="subtitle2">{label}</Typography>}

            {defaultValue && !selectedImagePreview && (
                <Image
                    unoptimized
                    src={defaultValue}
                    alt="Preview"
                    sizes="100vw"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '320px',
                    }}
                    width={320}
                    height={320}
                />
            )}

            {selectedImagePreview && (
                <Image
                    unoptimized
                    src={selectedImagePreview}
                    alt="Preview"
                    sizes="100vw"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '320px',
                    }}
                    width={320}
                    height={320}
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
                            disabled={disabled}
                            onClick={() => setSelectedImage(undefined)}>
                            Batal
                        </Button>
                    </Box>
                </Box>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </Box>
    )
}
