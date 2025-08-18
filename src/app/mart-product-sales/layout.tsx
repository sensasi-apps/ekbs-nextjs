// materials
import Box from '@mui/material/Box'
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import The401Protection from '@/components/the-401-protection'
import FooterBox from '@/components/footer-box'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Box
            px={2}
            sx={{
                userSelect: 'none',
                msUserSelect: 'none',
                webkitUserSelect: 'none',
                mozUserSelect: 'none',
            }}>
            <RedirectIfUnauth />

            <The401Protection />

            {children}

            <FooterBox />
        </Box>
    )
}
