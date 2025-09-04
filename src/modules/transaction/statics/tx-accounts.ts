import TransactionTag from '@/modules/transaction/enums/transaction-tag'

/**
 * DON'T FORGET TO SYNC WITH {@link TransactionTag | `TransactionTag`}
 */
const txAccounts: {
    income: TransactionTag[]
    expense: TransactionTag[]
} = {
    income: [
        //user loans
        TransactionTag.PENDAPATAN_DENDA,
        TransactionTag.PENDAPATAN_BUNGA_BANK,

        // palm bunch
        TransactionTag.PENDAPATAN_INSENTIF_RSPO,
        TransactionTag.PENDAPATAN_ADMINISTRASI,
        TransactionTag.PENDAPATAN_LAIN_LAIN,

        // coffee
        TransactionTag.PENDAPATAN_JASA_STAN_MAKANAN,
    ],
    expense: [
        // general costs
        TransactionTag.BEBAN_ANGSURAN,
        // TransactionTag.BEBAN_JASA_PENGURUS,
        // TransactionTag.BEBAN_JASA_PENGAWAS,
        // TransactionTag.BEBAN_JASA_PENDIRI,
        // TransactionTag.BEBAN_GAJI_PENGELOLA,
        TransactionTag.BEBAN_LAIN_LAIN,
        TransactionTag.BEBAN_ADMINISTRASI,

        // farm input costs
        TransactionTag.BEBAN_JASA_BAGI_HASIL_INVESTASI,
        TransactionTag.BEBAN_PERAWATAN_KANTOR,

        // heavy equipment costs
        TransactionTag.BEBAN_BAHAN_BAKAR_MINYAK,
        TransactionTag.BEBAN_PERAWATAN_MESIN,
        TransactionTag.BEBAN_PERBAIKAN_UNIT,
        TransactionTag.BEBAN_PENYUSUTAN,

        // he and user loan costs
        TransactionTag.BEBAN_OPERASIONAL,

        // user loan costs
        TransactionTag.BEBAN_JASA_SIMPANAN,

        // user loan and palm bunch costs
        TransactionTag.BEBAN_AIR_DAN_LISTRIK,

        // palm bunch costs
        TransactionTag.BEBAN_KEGIATAN_KANTOR,
        // TransactionTag.BEBAN_PENYERAHAN_SHU,
        TransactionTag.BEBAN_OPERASIONAL_KELOMPOK_TANI,
        TransactionTag.BEBAN_SERTIFIKASI_RSPO,
        TransactionTag.BEBAN_INVESTASI,
        TransactionTag.BEBAN_KEGIATAN_RAT,
        TransactionTag.BEBAN_PERJALANAN_DINAS,
        // TransactionTag.BEBAN_PPH_BADAN_PERIODE_SEBELUMNYA,

        TransactionTag.BANK_INTEREST_TAX,
    ],
}

export default txAccounts
