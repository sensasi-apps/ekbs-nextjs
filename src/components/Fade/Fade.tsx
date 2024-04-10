import MuiFade, { FadeProps as MuiFadeProps } from '@mui/material/Fade'

export type FadeProps = MuiFadeProps

export default function Fade({ children, ...restProps }: FadeProps) {
    return (
        <MuiFade exit={false} unmountOnExit {...restProps}>
            <span>{children}</span>
        </MuiFade>
    )
}
