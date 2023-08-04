import moment from 'moment'
import 'moment/locale/id'
import Loan from './loan'

class Installment {
    constructor({
        uuid,
        should_be_paid_at,
        amount_rp,
        penalty_rp,
        n_th,

        installmentable,
        installmentable_classname,
        transaction,
    }) {
        this.uuid = uuid
        this.should_be_paid_at = moment(should_be_paid_at)
        this.amount_rp = amount_rp
        this.penalty_rp = penalty_rp
        this.n_th = n_th

        if (installmentable_classname === 'App\\Models\\UserLoan') {
            this.installmentable = new Loan(installmentable)
            this.loan = this.installmentable
        }
        this.transaction = transaction
    }

    get isPaid() {
        return !!this.transaction
    }

    get status() {
        if (this.isPaid) return 'Lunas'
        if (moment().isAfter(this.should_be_paid_at)) return 'Terlambat'
        return '-'
    }
}

export default Installment
