// types
import type { AxiosError } from 'axios'
import type { MUIDataTableColumn } from 'mui-datatables'
import type { Mutate } from '@/components/Datatable/@types'
import type LaravelValidationException from '@/types/LaravelValidationException'
import type Debt from '@/dataTypes/Debt'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { GetRowDataType } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import FinanceApiUrlEnum from '@/components/pages/finances/ApiUrlEnum'
import FinancesDebtForm, {
    calcTotalRp,
    FormValuesType,
} from '@/components/pages/finances/debts/Form'
import SettlementForm from '@/components/pages/finances/debts/SettlementForm'
import ScrollableXBox from '@/components/ScrollableXBox'
// utils
import handle422 from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import shortUuid from '@/utils/uuidToShort'
import toDmy from '@/utils/toDmy'
import useAuth from '@/providers/Auth'
import Finance from '@/enums/permissions/Finance'

let getRowData: GetRowDataType<Debt>
let mutate: Mutate

export default function Debts() {
    const { userHasPermission } = useAuth()
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
        <AuthLayout title="Hutang">
            <Datatable
                title="Daftar"
                tableId="debts-table"
                apiUrl={FinanceApiUrlEnum.DEBT_DATATABLE_DATA}
                onRowClick={(_, { dataIndex }) => {
                    const data = getRowData(dataIndex)

                    setFormValues({
                        ...data,
                        is_final: Boolean(data?.hasDetails),
                    })
                    setDebtData(data)
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
            />

            <DialogWithTitle
                title="Tambah Data Hutang"
                open={Boolean(formValues)}>
                <Formik
                    initialValues={
                        formValues ?? {
                            is_final: false,
                        }
                    }
                    initialStatus={{ debtData, setDebtDetail }}
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
                    onReset={handleClose}
                    component={FinancesDebtForm}
                />
            </DialogWithTitle>

            <DialogWithTitle
                title="Pelunasan Hutang"
                open={Boolean(debtDetail)}>
                <Formik
                    initialValues={{
                        rp: debtDetail?.rp ?? 0,
                    }}
                    initialStatus={debtDetail}
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
                    onReset={() => setDebtDetail(undefined)}
                    component={SettlementForm}
                />
            </DialogWithTitle>

            <Fab
                in={userHasPermission(Finance.CREATE_DEBT)}
                disabled={!formValues}
                onClick={() => {
                    setFormValues({
                        is_final: false,
                    })
                    setDebtData({})
                }}>
                <PaymentsIcon />
            </Fab>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'Kode',
        options: {
            customBodyRender: shortUuid,
        },
    },
    {
        name: 'at',
        label: 'Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'businessUnit.name',
        label: 'Unit Bisnis',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.business_unit?.name,
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },
    {
        name: 'base_rp',
        label: 'Progres',
        options: {
            setCellProps: () => ({
                sx: {
                    width: '50%',
                    minWidth: 300,
                },
            }),
            customBodyRenderLite(dataIndex) {
                const data = getRowData(dataIndex)

                if (!data) return null

                if (!data.details)
                    return (
                        <Typography variant="caption" fontStyle="italic">
                            Data belum final
                        </Typography>
                    )

                const paidTotalRp = data.details.reduce(
                    (sum, detail) => sum + (detail.paid ? detail.rp : 0),
                    0,
                )
                const totalRp = calcTotalRp(data)

                const bars = data.details.map(({ paid }, i) => (
                    <LinearProgress
                        key={i}
                        sx={{
                            borderRadius: 5,
                            width: '100%',
                        }}
                        value={paid ? 100 : 0}
                        color={paid ? 'success' : 'inherit'}
                        variant="determinate"
                    />
                ))

                return (
                    <>
                        <ScrollableXBox mt={1}>{bars}</ScrollableXBox>
                        <Typography
                            mt={1}
                            variant="caption"
                            align="right"
                            component="div">
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
        },
    },
]
