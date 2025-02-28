import InputAdornment, {
    type InputAdornmentProps,
} from '@mui/material/InputAdornment'

/**
 * Renders an input adornment with "Rp" text.
 * @param position - The position of the adornment. Defaults to "start".
 * @param props - Additional props to pass to the InputAdornment component.
 * @returns The RpInputAdornment component.
 */
export default function RpInputAdornment({
    position = 'start',
    ...props
}: {
    position?: InputAdornmentProps['position']
} & Omit<InputAdornmentProps, 'position'>) {
    return (
        <InputAdornment position={position} {...props}>
            Rp
        </InputAdornment>
    )
}
