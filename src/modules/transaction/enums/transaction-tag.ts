// eslint-disable-next-line @typescript-eslint/no-unused-vars
import txAccounts from '@/modules/transaction/statics/tx-accounts'

/**
 * DON'T FORGET TO SYNC WITH {@link txAccounts | `txAccounts`}
 */
enum TransactionTag {
    // general
    ARISAN = 'Arisan',

    // BENGKEL = 'Bengkel', it should be unused now since repair-shop module is deployed

    EXCAVATOR = 'Excavator',
    GAJIAN_TBS = 'Gajian TBS',
    KOREKSI = 'Koreksi',
    TARIK_TUNAI = 'Tarik Tunai',

    // palm bunch / TBS
    PELUNASAN_TBS = 'Pelunasan TBS',
    INSENTIF_GRADING = 'Insentif Grading',
    POTONGAN_GRADING = 'Potongan Grading',

    POTONGAN_JASA_PERAWATAN = 'Potongan Jasa Perawatan',
    POTONGAN_JASA_PANEN = 'Potongan Jasa Panen',

    POTONGAN_BIAYA_ANGKUT = 'Potongan Biaya Angkut',
    PELUNASAN_BIAYA_ANGKUT = 'Pelunasan Biaya Angkut',

    // tax
    TAX = 'Pajak',

    // installments
    ANGSURAN_SAPRODI = 'Angsuran SAPRODI',
    ANGSURAN_ALAT_BERAT = 'Angsuran Alat Berat',
    ANGSURAN_SPP = 'Angsuran SPP',
    ANGSURAN_BELAYAN_SPARE_PARTS = 'Angsuran Belayan Spare Parts',

    // its dynamic, generated on BE, not a good idea to hardcode it
    // POTONGAN_JASA_KOPERASI = 'Potongan Jasa Koperasi',
    // POTONGAN_JASA_OPERASIONAL_KELOMPOK_TANI = 'Potongan Jasa Operasional Kelompok Tani',
    // POTONGAN_JASA_KONTRAKTOR = 'Potongan Jasa Kontraktor',
    // PPH_22 = 'Pph 22',
    PPH_22_0_25 = 'Pph 22 (0,25%)',
    POTONGAN_JASA_KOPERASI_1_50 = 'Potongan Jasa Koperasi (1,50%)',
    POTONGAN_JASA_OPERASIONAL_KELOMPOK_TANI_0_50 = 'Potongan Jasa Operasional Kelompok Tani (0,50%)',
    POTONGAN_JASA_KONTRAKTOR_RP_5 = 'Potongan Jasa Kontraktor (Rp. 5)',

    // general incomes (all units has this)
    PENDAPATAN_LAIN_LAIN = 'Pendapatan Lain-lain',

    //user loans
    PENDAPATAN_DENDA = 'Pendapatan Denda',
    PENDAPATAN_BUNGA_BANK = 'Pendapatan Bunga Bank',

    // palm bunch
    PENDAPATAN_INSENTIF_RSPO = 'Pendapatan Insentif RSPO',
    PENDAPATAN_ADMINISTRASI = 'Pendapatan Administrasi',

    // coffee
    PENDAPATAN_JASA_STAN_MAKANAN = 'Pendapatan Jasa Stan Makanan',

    // repair shop

    PENDAPATAN_JASA_PENCUCIAN = 'Pendapatan Jasa Pencucian',

    // ###################### COSTS

    // general costs
    BEBAN_JASA_PENGURUS = 'Beban Jasa Pengurus',
    BEBAN_JASA_PENGAWAS = 'Beban Jasa Pengawas',
    BEBAN_JASA_PENDIRI = 'Beban Jasa Pendiri',
    BEBAN_GAJI_PENGELOLA = 'Beban Gaji Pengelola',
    BEBAN_LAIN_LAIN = 'Beban Lain-lain',
    BEBAN_ADMINISTRASI = 'Beban Administrasi',
    BANK_INTEREST_TAX = 'Pajak Bunga Bank',

    // farm input and he
    BEBAN_ANGSURAN = 'Beban Angsuran',

    // farm input costs
    BEBAN_JASA_BAGI_HASIL_INVESTASI = 'Beban Jasa Bagi Hasil Investasi',
    BEBAN_PERAWATAN_KANTOR = 'Beban Perawatan Kantor',

    // heavy equipment costs
    BEBAN_BAHAN_BAKAR_MINYAK = 'Beban Bahan Bakar Minyak (BBM)',
    BEBAN_PERAWATAN_MESIN = 'Beban Perawatan Mesin',
    BEBAN_PERBAIKAN_UNIT = 'Beban Perbaikan Unit',
    BEBAN_PENYUSUTAN = 'Beban Penyusutan',

    // he and user loan costs
    BEBAN_OPERASIONAL = 'Beban Operasional',

    // user loan costs
    BEBAN_JASA_SIMPANAN = 'Beban Jasa Simpanan',

    // user loan and palm bunch costs
    BEBAN_AIR_DAN_LISTRIK = 'Beban Air & Listrik',

    // palm bunch costs
    BEBAN_KEGIATAN_KANTOR = 'Beban Kegiatan Kantor',
    BEBAN_PENYERAHAN_SHU = 'Beban Penyerahan SHU 2021',
    BEBAN_OPERASIONAL_KELOMPOK_TANI = 'Beban Operasional Kelompok Tani',
    BEBAN_SERTIFIKASI_RSPO = 'Beban Sertifikasi RSPO',
    BEBAN_INVESTASI = 'Beban Investasi',
    BEBAN_KEGIATAN_RAT = 'Beban Kegiatan RAT',
    BEBAN_PERJALANAN_DINAS = 'Beban Perjalanan Dinas',
    BEBAN_PPH_BADAN_PERIODE_SEBELUMNYA = 'PPH Badan Periode Sebelumnya',
}

export default TransactionTag
