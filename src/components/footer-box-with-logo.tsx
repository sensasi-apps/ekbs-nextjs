import Box from '@mui/material/Box'
import FooterBox from '@/components/footer-box'
import LogoImage from '@/components/LogoImage'

export default function FooterBoxWithLogo() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={3}
            mt={10}>
            <LogoImage />
            <FooterBox m={0} />
        </Box>
    )
}
