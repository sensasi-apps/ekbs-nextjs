// materials
import Box from '@mui/material/Box'
// component
import ContentGuard from '@/components/content-guard'
import FooterBox from '@/components/footer-box'
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import The401Protection from '@/components/the-401-protection'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box
            px={2}
            sx={{
                mozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                webkitUserSelect: 'none',
            }}>
            <RedirectIfUnauth />

            <The401Protection />

            <ContentGuard>{children}</ContentGuard>

            <FooterBox />
        </Box>
    )
}
