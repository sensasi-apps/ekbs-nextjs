import BusinessUnit from '@/enums/BusinessUnit'
import TransactionTag from '@/features/transaction/enums/transaction-tag'

type TypeType = 'income' | 'expense'

export default function getUnitTxTags(
    businessUnit: BusinessUnit,
    type: TypeType,
): string[] {
    if (
        ![
            BusinessUnit.SAPRODI,
            BusinessUnit.SPP,
            BusinessUnit.ALAT_BERAT,
            BusinessUnit.TBS,
        ].includes(businessUnit)
    )
        throw new Error('Invalid business unit')

    switch (businessUnit) {
        case BusinessUnit.SAPRODI:
            return getSaprodiTags(type).sort()
        case BusinessUnit.ALAT_BERAT:
            return getHeTags(type)
        case BusinessUnit.SPP:
            return getUserLoanTags(type)
        case BusinessUnit.TBS:
            return getPalmBunchTags(type)
    }

    throw new Error('something went wrong')
}

function getBasicTags(type: TypeType): string[] {
    if (type === 'income') {
        return [TransactionTag.PENDAPATAN_LAIN_LAIN]
    }

    if (type === 'expense') {
        return [
            // TransactionTag.BEBAN_JASA_PENGURUS,
            // TransactionTag.BEBAN_JASA_PENGAWAS,
            // TransactionTag.BEBAN_JASA_PENDIRI,
            // TransactionTag.BEBAN_GAJI_PENGELOLA,
            TransactionTag.BEBAN_ADMINISTRASI,
            TransactionTag.BEBAN_LAIN_LAIN,
        ]
    }

    throw new Error('Invalid type')
}

function getSaprodiTags(type: TypeType): string[] {
    const basicTags = getBasicTags(type)

    if (type === 'income') {
        return [...basicTags]
    }

    return [
        TransactionTag.BEBAN_ANGSURAN,
        TransactionTag.BEBAN_JASA_BAGI_HASIL_INVESTASI,
        TransactionTag.BEBAN_PERAWATAN_KANTOR,
        ...basicTags,
    ]
}

function getUserLoanTags(type: TypeType): string[] {
    if (type === 'income') {
        return [
            TransactionTag.PENDAPATAN_DENDA,
            TransactionTag.PENDAPATAN_BUNGA_BANK,
            ...getBasicTags(type),
        ]
    }

    return [
        TransactionTag.BEBAN_AIR_DAN_LISTRIK,
        TransactionTag.BEBAN_OPERASIONAL,
        TransactionTag.BEBAN_JASA_SIMPANAN,
        ...getBasicTags(type),
    ]
}

function getHeTags(type: TypeType): string[] {
    if (type === 'income') {
        return [...getBasicTags(type)]
    }

    return [
        TransactionTag.BEBAN_PERAWATAN_MESIN,
        TransactionTag.BEBAN_PERBAIKAN_UNIT,
        TransactionTag.BEBAN_ANGSURAN,
        // TransactionTag.BEBAN_PENYUSUTAN,
        TransactionTag.BEBAN_OPERASIONAL,
        ...getBasicTags(type),
    ]
}

function getPalmBunchTags(type: TypeType): string[] {
    if (type === 'income') {
        return [
            TransactionTag.PENDAPATAN_INSENTIF_RSPO,
            TransactionTag.PENDAPATAN_ADMINISTRASI,
            ...getBasicTags(type),
        ]
    }

    return [
        // TransactionTag::BEBAN_OPERASIONAL_KELOMPOK_TANI, // TODO: make query
        TransactionTag.BEBAN_SERTIFIKASI_RSPO,
        TransactionTag.BEBAN_PERAWATAN_KANTOR,
        TransactionTag.BEBAN_AIR_DAN_LISTRIK,
        TransactionTag.BEBAN_PENYERAHAN_SHU,
        TransactionTag.BEBAN_KEGIATAN_KANTOR,
        TransactionTag.BEBAN_PERJALANAN_DINAS,
        TransactionTag.BEBAN_PENYUSUTAN,
        TransactionTag.BEBAN_INVESTASI,
        TransactionTag.BEBAN_PPH_BADAN_PERIODE_SEBELUMNYA,
        TransactionTag.BEBAN_KEGIATAN_RAT,
        TransactionTag.BEBAN_OPERASIONAL,
        ...getBasicTags(type),
    ]
}
