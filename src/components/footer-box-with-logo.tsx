import Box from '@mui/material/Box'
import FooterBox from '@/components/footer-box'
import LogoImage from '@/components/LogoImage'

export default function FooterBoxWithLogo() {
    return (
        <Box
            alignItems="center"
            display="flex"
            gap={3}
            justifyContent="center"
            mt={10}>
            <LogoImage />
            <FooterBox m={0} />
        </Box>
    )
}
