// types
import type { ReactNode } from 'react'
// vendors
import { Box, Fab, FabProps, Typography } from '@mui/material'
import { Insights, Login, OpenInNew, Warehouse } from '@mui/icons-material'
import { Background } from '@/components/Layouts/background'

export function Landing() {
    return (
        <Background>
            <Box display="flex" flexDirection="column" gap={2}>
                <HeroSection />

                <PublicPagesSection />

                <EtcSection />
            </Box>
        </Background>
    )
}

const FAB_DEFAULT_PROPS: FabProps = {
    color: 'warning',
    variant: 'extended',
    size: 'small',
    sx: {
        px: 2,
    },
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
            <Typography variant="subtitle1" gutterBottom>
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
                display="flex"
                gap={2}
                alignItems="center"
                flexWrap="wrap"
                textOverflow="clip"
                mb={8}>
                <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    color="grey.300"
                    maxWidth="640px">
                    {process.env.NEXT_PUBLIC_APP_NAME}
                </Typography>
            </Box>

            <Fab
                {...FAB_DEFAULT_PROPS}
                href="login"
                color="success"
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
            <Box display="flex" gap={2} flexWrap="wrap">
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
            <Box display="flex" gap={2} flexWrap="wrap">
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
