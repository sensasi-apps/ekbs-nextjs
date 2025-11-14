'use client'

// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// materials
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// types
import type { AxiosError } from 'axios'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
// components
import Datatable, { type GetRowDataType } from '@/components/Datatable'
import type { DatatableProps, Mutate } from '@/components/Datatable/@types'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
import FinancesDebtForm, {
    calcTotalRp,
    type FormValuesType,
} from '@/components/pages/finances/debts/Form'
import SettlementForm from '@/components/pages/finances/debts/SettlementForm'
import ScrollableXBox from '@/components/ScrollableXBox'
// enums
import Finance from '@/enums/permissions/Finance'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type Debt from '@/types/orms/debt'
// utils
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import shortUuid from '@/utils/short-uuid'
import toDmy from '@/utils/to-dmy'

let getRowData: GetRowDataType<Debt>
let mutate: Mutate<Debt>

export default function Debts() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const [formValues, setFormValues] = useState<FormValuesType>()
    const [debtDetail, setDebtDetail] = useState<Debt['details'][0]>()
    const [debtData, setDebtData] = useState<Partial<Debt>>()

    function handleClose() {
        setFormValues(undefined)
        setDebtData(undefined)
    }

    function handleDetailClose() {
        setDebtDetail(undefined)
    }

    return (
        <>
            <PageTitle title="Hutang" />
            <Datatable
                apiUrl={FinanceApiUrlEnum.DEBT_DATATABLE_DATA}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={(_, { dataIndex }) => {
                    const data = getRowData(dataIndex)

                    setFormValues({
                        ...data,
                        is_final: Boolean(data?.hasDetails),
                    })
                    setDebtData(data)
                }}
                tableId="debts-table"
                title="Daftar"
            />

            <DialogWithTitle
                open={Boolean(formValues)}
                title="Tambah Data Hutang">
                <Formik
                    component={FinancesDebtForm}
                    initialStatus={{ debtData, setDebtDetail }}
                    initialValues={
                        formValues ?? {
                            is_final: false,
                        }
                    }
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                FinanceApiUrlEnum.UPDATE_OR_CREATE_DEBT.replace(
                                    '$uuid',
                                    debtData?.uuid ?? '',
                                ),
                                values,
                            )
                            .then(() => {
                                handleClose()
                                mutate()
                            })
                            .catch(
                                (
                                    error: AxiosError<LaravelValidationException>,
                                ) => handle422(error, setErrors),
                            )
                    }
                />
            </DialogWithTitle>

            <DialogWithTitle
                open={Boolean(debtDetail)}
                title="Pelunasan Hutang">
                <Formik
                    component={SettlementForm}
                    initialStatus={debtDetail}
                    initialValues={{
                        rp: debtDetail?.rp ?? 0,
                    }}
                    onReset={() => setDebtDetail(undefined)}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .put(
                                FinanceApiUrlEnum.SETTLEMENT_DEBT.replace(
                                    '$uuid',
                                    debtDetail?.uuid ?? '',
                                ),
                                values,
                            )
                            .then(() => {
                                handleDetailClose()
                                handleClose()
                                mutate()
                            })
                            .catch(
                                (
                                    error: AxiosError<LaravelValidationException>,
                                ) => handle422(error, setErrors),
                            )
                    }
                />
            </DialogWithTitle>

            <Fab
                disabled={!!formValues}
                in={isAuthHasPermission(Finance.CREATE_DEBT)}
                onClick={() => {
                    setFormValues({
                        is_final: false,
                    })
                    setDebtData({})
                }}>
                <PaymentsIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Debt>['columns'] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender: shortUuid,
        },
    },
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Unit Bisnis',
        name: 'businessUnit.name',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.business_unit?.name,
        },
    },
    {
        label: 'Catatan',
        name: 'note',
    },
    {
        label: 'Progres',
        name: 'base_rp',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                if (!data) return null

                if (!data.details)
                    return (
                        <Typography fontStyle="italic" variant="caption">
                            Data belum final
                        </Typography>
                    )

                const paidTotalRp = data.details.reduce(
                    (sum, detail) => sum + (detail.paid ? detail.rp : 0),
                    0,
                )
                const totalRp = calcTotalRp(data)

                const bars = data.details.map(({ paid, uuid }) => (
                    <LinearProgress
                        color={paid ? 'success' : 'inherit'}
                        key={uuid}
                        sx={{
                            borderRadius: 5,
                            width: '100%',
                        }}
                        value={paid ? 100 : 0}
                        variant="determinate"
                    />
                ))

                return (
                    <>
                        <ScrollableXBox mt={1}>{bars}</ScrollableXBox>
                        <Typography
                            align="right"
                            component="div"
                            mt={1}
                            variant="caption">
                            {numberToCurrency(paidTotalRp, {
                                notation: 'compact',
                            })}{' '}
                            /{' '}
                            {numberToCurrency(totalRp, {
                                notation: 'compact',
                            })}
                        </Typography>
                    </>
                )
            },
            setCellProps: () => ({
                sx: {
                    minWidth: 300,
                    width: '50%',
                },
            }),
        },
    },
]
