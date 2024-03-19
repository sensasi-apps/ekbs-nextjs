enum TransactionTag {
    // general
    ARISAN = 'Arisan',
    KOREKSI = 'Koreksi',

    TARIK_TUNAI = 'Tarik Tunai',
    GAJIAN_TBS = 'Gajian TBS',

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

    // its dynamic, generated on BE, not a good idea to hardcode it
    // POTONGAN_JASA_KOPERASI = 'Potongan Jasa Koperasi',
    // POTONGAN_JASA_OPERASIONAL_KELOMPOK_TANI = 'Potongan Jasa Operasional Kelompok Tani',
    // POTONGAN_JASA_KONTRAKTOR = 'Potongan Jasa Kontraktor',
    // PPH_22 = 'Pph 22',
}

export default TransactionTag
