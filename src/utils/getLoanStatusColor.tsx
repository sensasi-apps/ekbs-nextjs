import type LoanType from '@/dataTypes/Loan'

export default function getLoanStatusColor(status: LoanType['status']) {
    if (status === 'angsuran aktif') {
        return 'info.main'
    }

    if (status === 'menunggu pencairan' || status === 'menunggu persetujuan') {
        return 'warning.main'
    }

    return ''
}
