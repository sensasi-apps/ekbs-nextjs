import Typography from '@mui/material/Typography'

/**
 * Renders the content for the Terms and Conditions (TNC) and Privacy
 * Policy (PP) of the e-KBS application. This component displays the latest
 * version date and the content of the TNC and PP.
 */
export default function PolicyContent() {
    return (
        <>
            <Typography gutterBottom variant="caption">
                Terakhir diperbaharui: 31 Juli 2023
            </Typography>

            <Typography component="h1" gutterBottom variant="h4">
                Syarat dan Ketentuan
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Tujuan Aplikasi
            </Typography>

            <Typography gutterBottom>
                Aplikasi Koperasi Belayan Sejahtera Elektronik (e-KBS) bertujuan
                untuk membantu pengurus, pengelola dan anggota Koperasi Belayan
                Sejahtera serta pelanggan unit usahanya dalam mengelola
                operasional dan informasi terkait koperasi. Penggunaan aplikasi
                e-KBS tunduk pada aturan dan peraturan yang berlaku.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Akun Pengguna
            </Typography>

            <Typography gutterBottom>
                Setiap pengguna e-KBS bertanggung jawab untuk menjaga dan
                mengamankan informasi-informasi yang bersifat sensitif (seperti
                alamat, nomor KTP, tanggal lahir, dll) yang dimasukkan atau
                didapatkan dari aplikasi e-KBS. Pengguna harus menjaga
                kerahasiaan kata sandi dan tidak mengizinkan akses oleh pihak
                ketiga.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Ketentuan Penggunaan
            </Typography>

            <Typography gutterBottom>
                Setiap pengguna e-KBS harus menggunakan aplikasi ini sesuai
                dengan ketentuan hukum yang berlaku dan tidak diperkenankan
                untuk melakukan tindakan yang melanggar hukum atau merugikan
                pihak lain.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Pemeliharaan Data
            </Typography>

            <Typography gutterBottom>
                Pengguna bertanggung jawab untuk memastikan bahwa data yang
                dimasukkan ke dalam aplikasi selalu akurat dan terkini.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Penghentian Akses
            </Typography>

            <Typography gutterBottom>
                Koperasi Belayan Sejahtera berhak untuk menghentikan akses
                pengguna ke e-KBS jika terdapat indikasi penyalahgunaan,
                pelanggaran terhadap ketentuan, atau alasan lain yang dianggap
                tepat oleh Koperasi Belayan Sejahtera.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Pembaharuan Syarat dan Ketentuan
            </Typography>

            <Typography gutterBottom>
                Syarat dan Ketentuan ini dapat diperbaharui dari waktu ke waktu.
                Perubahan akan diumumkan melalui aplikasi, email, atau sarana
                penyebaran informasi lainnya.
            </Typography>

            <Typography component="h1" gutterBottom mt={4} variant="h4">
                Kebijakan Privasi
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Informasi Pribadi
            </Typography>

            <Typography gutterBottom>
                Aplikasi Koperasi Belayan Sejahtera Elektronik (e-KBS) akan
                mengumpulkan informasi pribadi pengguna seperti nama, alamat,
                nomor kontak, dan informasi lainnya. Informasi ini akan
                digunakan hanya untuk kepentingan operasional Koperasi Belayan
                Sejahtera dan tidak akan dibagikan kepada pihak ketiga tanpa
                izin.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Penggunaan Data
            </Typography>

            <Typography gutterBottom>
                Data pengguna yang terkumpul akan digunakan untuk keperluan
                administrasi, pelaporan, dan analisis oleh Koperasi Belayan
                Sejahtera.
            </Typography>

            <Typography component="h2" gutterBottom mt={2} variant="h5">
                Perubahan Kebijakan
            </Typography>

            <Typography gutterBottom>
                Kebijakan privasi ini dapat diperbaharui dari waktu ke waktu.
                Perubahan akan diumumkan melalui aplikasi, email, atau sarana
                penyebaran informasi lainnya.
            </Typography>
        </>
    )
}
