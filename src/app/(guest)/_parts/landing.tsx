// types

import Insights from '@mui/icons-material/Insights'
import Login from '@mui/icons-material/Login'
import OpenInNew from '@mui/icons-material/OpenInNew'
import Warehouse from '@mui/icons-material/Warehouse'
// vendors
import Box from '@mui/material/Box'
import Fab, { type FabProps } from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

export default function Landing() {
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <HeroSection />

            <PublicPagesSection />

            <EtcSection />
        </Box>
    )
}

const FAB_DEFAULT_PROPS: FabProps = {
    color: 'warning',
    size: 'small',
    sx: {
        px: 2,
    },
    variant: 'extended',
}

const MR_ICON_DEFAULT_SX = {
    mr: 1,
}

const ML_ICON_DEFAULT_SX = {
    ml: 1,
}

function Section({
    introText,
    children,
}: {
    introText: string
    children: ReactNode
}) {
    return (
        <Box>
            <Typography gutterBottom variant="subtitle1">
                {introText}
            </Typography>

            {children}
        </Box>
    )
}

function HeroSection() {
    return (
        <Section introText="Anda sedang berada pada laman aplikasi">
            <Box
                alignItems="center"
                display="flex"
                flexWrap="wrap"
                gap={2}
                mb={8}
                textOverflow="clip">
                <Typography
                    color="grey.300"
                    component="h1"
                    fontWeight="bold"
                    maxWidth="640px"
                    variant="h3">
                    {process.env.NEXT_PUBLIC_APP_NAME}
                </Typography>
            </Box>

            <Fab
                {...FAB_DEFAULT_PROPS}
                color="success"
                href="login"
                size="large"
                sx={{
                    fontSize: '1.1rem',
                    p: 3,
                }}>
                Masuk
                <Login sx={ML_ICON_DEFAULT_SX} />
            </Fab>
        </Section>
    )
}

function PublicPagesSection() {
    return (
        <Section introText="kunjungi halaman publik">
            <Box display="flex" flexWrap="wrap" gap={2}>
                <Fab href="katalog-saprodi" {...FAB_DEFAULT_PROPS}>
                    <Warehouse sx={MR_ICON_DEFAULT_SX} />
                    Katalog Saprodi
                </Fab>

                <Fab {...FAB_DEFAULT_PROPS} href="laporan-performa">
                    <Insights sx={MR_ICON_DEFAULT_SX} />
                    Performa Koperasi
                </Fab>
            </Box>
        </Section>
    )
}

function EtcSection() {
    return (
        <Section introText="atau lainnya">
            <Box display="flex" flexWrap="wrap" gap={2}>
                <Fab {...FAB_DEFAULT_PROPS} href="https://belayansejahtera.org">
                    Berita
                    <OpenInNew sx={ML_ICON_DEFAULT_SX} />
                </Fab>

                <Fab
                    {...FAB_DEFAULT_PROPS}
                    color="error"
                    href="https://simulasi-grading-sawit.web.app/">
                    Kalkulator Grading
                    <OpenInNew sx={ML_ICON_DEFAULT_SX} />
                </Fab>
            </Box>
        </Section>
    )
}
