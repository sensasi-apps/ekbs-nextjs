import Image from 'next/image'

const LogoImage = () => (
    <Image
        alt="logo"
        height={50}
        src="/assets/pwa-icons/white-green.svg"
        style={{
            borderRadius: '15%',
        }}
        width={50}
    />
)

export default LogoImage
