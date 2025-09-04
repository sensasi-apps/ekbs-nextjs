// types
import type InstallmentORM from '@/modules/installment/types/orms/installment'
// vendors
import { memo } from 'react'
import useSWR from 'swr'
// materials
import Grid from '@mui/material/Grid'
// icons
import CreditCardIcon from '@mui/icons-material/CreditCard'
// components
import BigNumber from '@/components/StatCard/BigNumber'
import FlexColumnBox from '@/components/FlexColumnBox'
import ScrollableXBox from '@/components/ScrollableXBox'
// page components
import Heading2 from '@/components/pages/executive/statistics/Heading2'
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
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                    display="flex"
                    flexDirection="column"
                    gap={1.5}>
                    <BigNumber
                        title="Total — Saat Ini"
                        isLoading={isLoading}
                        primary={numberToCurrency(total1, {
                            notation: 'compact',
                        })}
                    />

                    <ScrollableXBox
                        gap="inherit"
                        sx={{
                            '> div': {
                                minWidth: 'fit-content',
                            },
                        }}>
                        <BigNumber
                            title="Alat Berat"
                            isLoading={isLoading}
                            primary={numberToCurrency(alatBerat1, {
                                notation: 'compact',
                            })}
                        />

                        <BigNumber
                            title="SAPRODI"
                            isLoading={isLoading}
                            primary={numberToCurrency(saprodi1, {
                                notation: 'compact',
                            })}
                        />

                        <BigNumber
                            title="SPP"
                            isLoading={isLoading}
                            primary={numberToCurrency(spp1, {
                                notation: 'compact',
                            })}
                        />
                    </ScrollableXBox>
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                    display="flex"
                    flexDirection="column"
                    gap={1.5}>
                    <BigNumber
                        title="Total — Lewat Jatuh Tempo"
                        isLoading={isLoading}
                        color={total2 > 0 ? 'error' : 'success'}
                        primary={numberToCurrency(total2, {
                            notation: 'compact',
                        })}
                    />

                    <ScrollableXBox
                        gap="inherit"
                        sx={{
                            '> div': {
                                minWidth: 'fit-content',
                            },
                        }}>
                        <BigNumber
                            title="Alat Berat"
                            isLoading={isLoading}
                            color={alatBerat2 > 0 ? 'error' : 'success'}
                            primary={numberToCurrency(alatBerat2, {
                                notation: 'compact',
                            })}
                        />

                        <BigNumber
                            title="SAPRODI"
                            isLoading={isLoading}
                            color={saprodi2 > 0 ? 'error' : 'success'}
                            primary={numberToCurrency(saprodi2, {
                                notation: 'compact',
                            })}
                        />

                        <BigNumber
                            title="SPP"
                            isLoading={isLoading}
                            color={spp2 > 0 ? 'error' : 'success'}
                            primary={numberToCurrency(spp2, {
                                notation: 'compact',
                            })}
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
    }
}
