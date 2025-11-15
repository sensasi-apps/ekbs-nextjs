import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link'
import type { ComponentProps } from 'react'
import NextLink from '@/components/next-link'

/**
 * @see {@link https://github.com/vercel/next.js/blob/a9cb9eca115afb0ad6431abd859bd45c98fa043d/docs/01-app/03-api-reference/02-components/link.mdx?plain=1#L1118-L1120|nextjs custom link props}
 */
type LinkProps = Omit<MuiLinkProps, 'href'> & ComponentProps<typeof NextLink>

/**
 * A custom Link component that integrates Next.js's routing with Material-UI's styling to achieve strong route type.
 */
export default function Link(props: LinkProps) {
    return <MuiLink component={NextLink} {...props} />
}
