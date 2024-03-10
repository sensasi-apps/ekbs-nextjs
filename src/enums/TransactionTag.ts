enum TransactionTag {
    // general
    COURIER = 'courier',

    // palm bunch / TBS
    PELUNASAN_TBS = 'Pelunasan TBS',
    INSENTIF_GRADING = 'Insentif Grading',
    POTONGAN_GRADING = 'Potongan Grading',

    POTONGAN_BIAYA_JASA_KOPERASI = 'Potongan Biaya Jasa Koperasi',
    POTONGAN_BIAYA_JASA_OPERASIONAL_KELOMPOK_TANI = 'Potongan Biaya Jasa Operasional Kelompok Tani',

    POTONGAN_BIAYA_ANGKUT = 'Potongan Biaya Angkut',
    PELUNASAN_BIAYA_ANGKUT = 'Pelunasan Biaya Angkut',

    // tax
    TAX = 'Pajak',
    PPH_22 = 'Pph 22',

    // installments
    ANGSURAN_SAPRODI = 'Angsuran SAPRODI',
    ANGSURAN_ALAT_BERAT = 'Angsuran Alat Berat',
    ANGSURAN_SPP = 'Angsuran SPP',
}

export default TransactionTag
