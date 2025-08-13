import type { Installment } from '@/dataTypes/Installment'

export default function getInstallmentColor({
    state,
}: Installment): 'error.main' | 'warning.main' | 'success.main' | undefined {
    switch (state) {
        case 'Jatuh Tempo':
            return 'error.main'

        case 'Jatuh Tempo Dalam 7 Hari':
            return 'warning.main'

        case 'Lunas':
            return 'success.main'
    }
}
