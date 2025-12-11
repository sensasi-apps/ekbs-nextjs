'use client'

// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// materials
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { Route } from 'next'
// vendors
import { useRouter } from 'next/navigation'
import NextLink from '@/components/next-link'

export default function BackButtonV2({
    href,
    ...props
}: IconButtonProps & {
    href?: Route
}) {
    const { push, back } = useRouter()

    if (href) {
        return (
            <NextLink href={href}>
                <IconButton {...props}>
                    <ArrowBackIcon />
                </IconButton>
            </NextLink>
        )
    }

    return (
        <IconButton
            onClick={() => (window.history.length > 1 ? back() : push('/'))}
            {...props}>
            <ArrowBackIcon />
        </IconButton>
    )
}
