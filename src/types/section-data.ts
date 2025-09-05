import type { BigNumberCardProps } from '@/components/big-number-card'

export default interface SectionData {
    bigNumber1: BigNumberCardProps
    bigNumber2: BigNumberCardProps
    lineChart: {
        title: string
        data: { label: string; value: number }[]
    }
}
