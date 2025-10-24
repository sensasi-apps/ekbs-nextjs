import CameraAltIcon from '@mui/icons-material/CameraAlt'
// icons
import ImageIcon from '@mui/icons-material/Image'
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
// vendors
import { type ChangeEvent, useEffect, useState } from 'react'
import type FileFromDb from '@/types/orms/file'
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

            <Box mb={0.5} mt={1}>
                <ImageRenderer
                    alt={label}
                    disabled={disabled}
                    file={selectedImage ?? value}
                />
            </Box>

            <MainInput
                disabled={disabled}
                error={error}
                helperText={helperText}
                name={name}
                onCancel={() => setSelectedImage(undefined)}
                onChange={handleImageChange}
                selectedImage={selectedImage}
                value={value}
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

    return <ImageButtonAndModal alt={alt} disabled={disabled} file={file} />
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
        <FormControl error={error} fullWidth>
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
                            accept="image/*"
                            hidden
                            name={name}
                            onChange={onChange}
                            type="file"
                        />
                    </Button>

                    {isCaptureSupported && (
                        <Button
                            component="label"
                            disabled={disabled}
                            startIcon={<CameraAltIcon />}>
                            Buka Kamera
                            <input
                                accept="image/*"
                                capture="user"
                                hidden
                                name={`${name}_capture`}
                                onChange={onChange}
                                type="file"
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
