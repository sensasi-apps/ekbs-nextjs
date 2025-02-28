import type { BoxProps } from '@mui/material/Box'
import type FileFromDb from '@/dataTypes/File'
// vendors
import { useEffect, useState, type ChangeEvent } from 'react'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
// icons
import ImageIcon from '@mui/icons-material/Image'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ImageButtonAndModal from './ImageButtonAndModal'

export default function ImageInput({
    sx,
    name,
    label,
    onChange,
    error,
    helperText,
    value,
    disabled,
}: ImageInputProps) {
    const [selectedImage, setSelectedImage] = useState<File>()

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.target

        setSelectedImage(files?.[0])
        onChange?.(event)
    }

    return (
        <Box mb={1} sx={sx}>
            {label && <Typography variant="subtitle2">{label}</Typography>}

            <Box mt={1} mb={0.5}>
                <ImageRenderer
                    file={selectedImage ?? value}
                    alt={label}
                    disabled={disabled}
                />
            </Box>

            <MainInput
                error={error}
                disabled={disabled}
                value={value}
                name={name}
                selectedImage={selectedImage}
                helperText={helperText}
                onChange={handleImageChange}
                onCancel={() => setSelectedImage(undefined)}
            />
        </Box>
    )
}

function ImageRenderer({
    file,
    alt = 'Gambar',
    disabled,
}: {
    file?: FileFromDb | File
    alt?: string
    disabled?: boolean
}) {
    if (!file) return null

    return <ImageButtonAndModal file={file} alt={alt} disabled={disabled} />
}

function MainInput({
    error,
    disabled,
    value,
    name,
    selectedImage,
    helperText,
    onChange,
    onCancel,
}: MainInputProps) {
    const [isCaptureSupported, setIsCaptureSupported] = useState(true)

    useEffect(() => {
        const input = document.createElement('input')
        setIsCaptureSupported('capture' in input)
    }, [])

    return (
        <FormControl fullWidth error={error}>
            <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={2}>
                    <Button
                        component="label"
                        disabled={disabled}
                        startIcon={<ImageIcon />}>
                        {value || selectedImage
                            ? 'Ganti Pilihan'
                            : 'Pilih file'}
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            name={name}
                            onChange={onChange}
                        />
                    </Button>

                    {isCaptureSupported && (
                        <Button
                            component="label"
                            disabled={disabled}
                            startIcon={<CameraAltIcon />}>
                            Buka Kamera
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                capture="user"
                                name={name + '_capture'}
                                onChange={onChange}
                            />
                        </Button>
                    )}
                </Box>

                <Button
                    color="warning"
                    disabled={disabled}
                    onClick={onCancel}
                    sx={{
                        display: selectedImage ? 'flex' : 'none',
                    }}>
                    Batal
                </Button>
            </Box>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

interface MainInputProps {
    error: boolean
    disabled?: boolean
    value?: FileFromDb
    name: string
    helperText?: string | string[]

    selectedImage?: File
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onCancel?: () => void
}

interface ImageInputProps {
    name: MainInputProps['name']
    error: MainInputProps['error']
    helperText: MainInputProps['helperText']
    value?: MainInputProps['value']
    disabled?: MainInputProps['disabled']

    sx?: BoxProps['sx']
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    label?: string
}
