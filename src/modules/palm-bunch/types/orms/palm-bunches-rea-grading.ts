import type PalmBunchesReaGradingItemORM from './palm-bunches-rea-grading-item'

export default interface PalmBunchesReaGradingORM {
    id: number
    value?: number
    item: PalmBunchesReaGradingItemORM
}
