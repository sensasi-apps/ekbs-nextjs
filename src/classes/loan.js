import moment from 'moment'
import Installment from './Installment'

class Loan {
    constructor({
        uuid,
        user_uuid,
        proposed_at = Date.now(),
        proposed_rp,
        interest_percent = 1.5,
        n_term,
        term_unit,
        type,
        purpose,
        is_approved,
        status,

        user,
        responses = [],
        transaction,
        activity_logs = [],
        installments = [],
    } = {}) {
        this.uuid = uuid
        this.user_uuid = user_uuid
        this.proposed_at = moment(proposed_at)
        this.proposed_rp = proposed_rp
        this.interest_percent = interest_percent
        this.n_term = n_term
        this.purpose = purpose
        this.type = type
        this.term_unit = term_unit
        this.is_approved = is_approved
        this.status = status

        this.user = user
        this.responses = responses
        this.transaction = transaction
        this.activity_logs = activity_logs
        this.installments = installments.map(
            installment => new Installment(installment),
        )
    }

    get hasUuid() {
        return this.uuid !== undefined
    }

    get hasResponses() {
        return this.responses.length > 0
    }

    get isDisbursed() {
        return Boolean(this.transaction)
    }

    get interestRp() {
        return Math.ceil((this.proposed_rp * this.interest_percent) / 100)
    }

    get principalInstallment() {
        return Math.ceil(this.proposed_rp / this.n_term)
    }

    get installmentAmount() {
        return this.principalInstallment + this.interestRp
    }

    get statusColor() {
        if (this.uuid === undefined) return 'info.main'
        if (this.is_approved === false) return 'error.main'
        if (this.is_approved === null) return 'warning.main'
        if (!this.transaction) return 'info.main'
        if (this.isHasUnpaidInstallment) return 'info.main'

        return 'success.main'
    }

    get hasInstallments() {
        return this.installments?.length > 0
    }

    get isHasUnpaidInstallment() {
        return this.installments.some(installment => !installment.transaction)
    }

    get canBeDisbursed() {
        return this.is_approved && !this.isDisbursed
    }

    get isRejected() {
        return this.responses?.some(response => !response.is_approved)
    }

    hasResponsedByUser = user =>
        this.responses?.some(response => response.by_user_uuid === user.uuid)

    isCreatedByUser = user =>
        this.activity_logs.some(
            log => log.user_uuid === user.uuid && log.action === 'created',
        )

    static colorByStatus = status => {
        switch (status) {
            case 'Baru':
                return 'info.main'
            case 'Menunggu Persetujuan':
                return 'warning.main'
            case 'Ditolak':
                return 'error.main'
            case 'Menunggu Pencairan':
                return 'info.main'
            case 'Angsuran Aktif':
                return 'info.main'
            case 'Selesai':
                return 'success.main'
            default:
                return 'text.primary'
        }
    }
}

export default Loan
