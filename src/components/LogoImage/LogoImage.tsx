import Image from 'next/image'

const LogoImage = () => (
    <Image
        src="/assets/pwa-icons/white-green.svg"
        alt="logo"
        width={50}
        height={50}
        style={{
            borderRadius: '15%',
        }}
    />
)

export default LogoImage
