import type InstallmentORM from '@/modules/installment/types/orms/installment'

export default function getInstallmentColor({
    state,
}: InstallmentORM): 'error.main' | 'warning.main' | 'success.main' | undefined {
    switch (state) {
        case 'Jatuh Tempo':
            return 'error.main'

        case 'Jatuh Tempo Dalam 7 Hari':
            return 'warning.main'

        case 'Lunas':
            return 'success.main'
    }
}
