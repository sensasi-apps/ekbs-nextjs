// types

// icons
import CreditCardIcon from '@mui/icons-material/CreditCard'
// materials
import Grid from '@mui/material/Grid'
// vendors
import { memo } from 'react'
import useSWR from 'swr'
import FlexColumnBox from '@/components/flex-column-box'
// page components
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import ScrollableXBox from '@/components/ScrollableXBox'
// components
import BigNumber from '@/components/StatCard/BigNumber'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
// utils
import numberToCurrency from '@/utils/number-to-currency'

type DataType = {
    installmentable_classname: InstallmentORM['installmentable_classname']
    amount_rp_sum: number
}

type ApiResponseType = {
    all_unpaid_receivables: DataType[]
    pass_due_receivables: DataType[]
}

const ReceivableSection = memo(function ReceivableSection() {
    const { data, isLoading } = useSWR<ApiResponseType>(
        'executive/receivable-section-data',
    )

    const {
        total1,
        total2,
        alatBerat1,
        alatBerat2,
        saprodi1,
        saprodi2,
        spp1,
        spp2,
    } = calc(data)

    return (
        <FlexColumnBox>
            <Heading2 id="piutang" startIcon={<CreditCardIcon />}>
                Piutang
            </Heading2>

            <Grid container spacing={1.5}>
                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                    size={{
                        md: 6,
                        xs: 12,
                    }}>
                    <BigNumber
                        isLoading={isLoading}
                        primary={numberToCurrency(total1, {
                            notation: 'compact',
                        })}
                        title="Total — Saat Ini"
                    />

                    <ScrollableXBox
                        gap="inherit"
                        sx={{
                            '> div': {
                                minWidth: 'fit-content',
                            },
                        }}>
                        <BigNumber
                            isLoading={isLoading}
                            primary={numberToCurrency(alatBerat1, {
                                notation: 'compact',
                            })}
                            title="Alat Berat"
                        />

                        <BigNumber
                            isLoading={isLoading}
                            primary={numberToCurrency(saprodi1, {
                                notation: 'compact',
                            })}
                            title="SAPRODI"
                        />

                        <BigNumber
                            isLoading={isLoading}
                            primary={numberToCurrency(spp1, {
                                notation: 'compact',
                            })}
                            title="SPP"
                        />
                    </ScrollableXBox>
                </Grid>

                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                    size={{
                        md: 6,
                        xs: 12,
                    }}>
                    <BigNumber
                        color={total2 > 0 ? 'error' : 'success'}
                        isLoading={isLoading}
                        primary={numberToCurrency(total2, {
                            notation: 'compact',
                        })}
                        title="Total — Lewat Jatuh Tempo"
                    />

                    <ScrollableXBox
                        gap="inherit"
                        sx={{
                            '> div': {
                                minWidth: 'fit-content',
                            },
                        }}>
                        <BigNumber
                            color={alatBerat2 > 0 ? 'error' : 'success'}
                            isLoading={isLoading}
                            primary={numberToCurrency(alatBerat2, {
                                notation: 'compact',
                            })}
                            title="Alat Berat"
                        />

                        <BigNumber
                            color={saprodi2 > 0 ? 'error' : 'success'}
                            isLoading={isLoading}
                            primary={numberToCurrency(saprodi2, {
                                notation: 'compact',
                            })}
                            title="SAPRODI"
                        />

                        <BigNumber
                            color={spp2 > 0 ? 'error' : 'success'}
                            isLoading={isLoading}
                            primary={numberToCurrency(spp2, {
                                notation: 'compact',
                            })}
                            title="SPP"
                        />
                    </ScrollableXBox>
                </Grid>
            </Grid>
        </FlexColumnBox>
    )
})

export default ReceivableSection

function calc(data: ApiResponseType | undefined) {
    return {
        alatBerat1:
            data?.all_unpaid_receivables.find(
                item =>
                    item.installmentable_classname ===
                    'App\\Models\\RentItemRent',
            )?.amount_rp_sum ?? 0,

        alatBerat2:
            data?.pass_due_receivables.find(
                item =>
                    item.installmentable_classname ===
                    'App\\Models\\RentItemRent',
            )?.amount_rp_sum ?? 0,

        saprodi1:
            data?.all_unpaid_receivables.find(
                item =>
                    item.installmentable_classname ===
                    'App\\Models\\ProductSale',
            )?.amount_rp_sum ?? 0,

        saprodi2:
            data?.pass_due_receivables.find(
                item =>
                    item.installmentable_classname ===
                    'App\\Models\\ProductSale',
            )?.amount_rp_sum ?? 0,

        spp1:
            data?.all_unpaid_receivables.find(
                item =>
                    item.installmentable_classname === 'App\\Models\\UserLoan',
            )?.amount_rp_sum ?? 0,

        spp2:
            data?.pass_due_receivables.find(
                item =>
                    item.installmentable_classname === 'App\\Models\\UserLoan',
            )?.amount_rp_sum ?? 0,
        total1:
            data?.all_unpaid_receivables.reduce(
                (acc, curr) => acc + curr.amount_rp_sum,
                0,
            ) ?? 0,

        total2:
            data?.pass_due_receivables.reduce(
                (acc, curr) => acc + curr.amount_rp_sum,
                0,
            ) ?? 0,
    }
}
