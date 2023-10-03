import { FC, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'

import LoadingButton from '@mui/lab/LoadingButton'
import useAuth from '@/providers/Auth'

const TncpDialog: FC<{
    open: boolean
    handleClose: () => void
}> = ({ open, handleClose }) => {
    const { user } = useAuth()

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (
            user &&
            user.is_agreed_tncp === false &&
            router.pathname !== '/logout'
        ) {
            setIsOpen(true)
        }
    }, [user])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setIsLoading(true)

        axios.post(`/users/agree-tcnp`).then(() => {
            setIsOpen(false)
            setIsLoading(false)
        })
    }

    return (
        <Dialog open={isOpen || open}>
            <DialogContent>
                <Typography variant="caption" gutterBottom>
                    Terakhir diperbaharui: 31 Juli 2023
                </Typography>

                <Typography variant="h4" component="h1" gutterBottom>
                    Syarat dan Ketentuan
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Tujuan Aplikasi
                </Typography>

                <Typography gutterBottom>
                    Aplikasi Koperasi Belayan Sejahtera Elektronik (e-KBS)
                    bertujuan untuk membantu pengurus, pengelola dan anggota
                    Koperasi Belayan Sejahtera serta pelanggan unit usahanya
                    dalam mengelola operasional dan informasi terkait koperasi.
                    Penggunaan aplikasi e-KBS tunduk pada aturan dan peraturan
                    yang berlaku.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Akun Pengguna
                </Typography>

                <Typography gutterBottom>
                    Setiap pengguna e-KBS bertanggung jawab untuk menjaga dan
                    mengamankan informasi-informasi yang bersifat sensitif
                    (seperti alamat, nomor KTP, tanggal lahir, dll) yang
                    dimasukkan atau didapatkan dari aplikasi e-KBS. Pengguna
                    harus menjaga kerahasiaan kata sandi dan tidak mengizinkan
                    akses oleh pihak ketiga.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Ketentuan Penggunaan
                </Typography>

                <Typography gutterBottom>
                    Setiap pengguna e-KBS harus menggunakan aplikasi ini sesuai
                    dengan ketentuan hukum yang berlaku dan tidak diperkenankan
                    untuk melakukan tindakan yang melanggar hukum atau merugikan
                    pihak lain.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Pemeliharaan Data
                </Typography>

                <Typography gutterBottom>
                    Pengguna bertanggung jawab untuk memastikan bahwa data yang
                    dimasukkan ke dalam aplikasi selalu akurat dan terkini.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Penghentian Akses
                </Typography>

                <Typography gutterBottom>
                    Koperasi Belayan Sejahtera berhak untuk menghentikan akses
                    pengguna ke e-KBS jika terdapat indikasi penyalahgunaan,
                    pelanggaran terhadap ketentuan, atau alasan lain yang
                    dianggap tepat oleh Koperasi Belayan Sejahtera.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Pembaharuan Syarat dan Ketentuan
                </Typography>

                <Typography gutterBottom>
                    Syarat dan Ketentuan ini dapat diperbaharui dari waktu ke
                    waktu. Perubahan akan diumumkan melalui aplikasi, email,
                    atau sarana penyebaran informasi lainnya.
                </Typography>

                <Typography variant="h4" component="h1" gutterBottom mt={4}>
                    Kebijakan Privasi
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Informasi Pribadi
                </Typography>

                <Typography gutterBottom>
                    Aplikasi Koperasi Belayan Sejahtera Elektronik (e-KBS) akan
                    mengumpulkan informasi pribadi pengguna seperti nama,
                    alamat, nomor kontak, dan informasi lainnya. Informasi ini
                    akan digunakan hanya untuk kepentingan operasional Koperasi
                    Belayan Sejahtera dan tidak akan dibagikan kepada pihak
                    ketiga tanpa izin.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Penggunaan Data
                </Typography>

                <Typography gutterBottom>
                    Data pengguna yang terkumpul akan digunakan untuk keperluan
                    administrasi, pelaporan, dan analisis oleh Koperasi Belayan
                    Sejahtera.
                </Typography>

                <Typography variant="h5" component="h2" gutterBottom mt={2}>
                    Perubahan Kebijakan
                </Typography>

                <Typography gutterBottom>
                    Kebijakan privasi ini dapat diperbaharui dari waktu ke
                    waktu. Perubahan akan diumumkan melalui aplikasi, email,
                    atau sarana penyebaran informasi lainnya.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        setIsOpen(false)
                        handleClose()
                        if (user?.is_agreed_tncp === false) {
                            router.push('/logout')
                        }
                    }}>
                    {user?.is_agreed_tncp === false
                        ? 'Saya tidak menyetujui Syarat, Ketentuan, dan Kebijakan (logout)'
                        : 'Tutup'}
                </Button>
                {user?.is_agreed_tncp === false && (
                    <form onSubmit={handleSubmit}>
                        <LoadingButton
                            loading={isLoading}
                            type="submit"
                            variant="contained">
                            Saya telah membaca dan menyetujui Syarat, Ketentuan,
                            dan Kebijakan Privasi ini
                        </LoadingButton>
                    </form>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default TncpDialog
