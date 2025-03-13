// types
import type { UUID } from 'crypto'
import type Payroll from '@/dataTypes/Payroll'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
import VisibilityIcon from '@mui/icons-material/Visibility'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import FinanceApiUrlEnum from '@/components/pages/finances/ApiUrlEnum'
import FinancesPayrollsForm from '@/components/pages/finances/payrolls/Form'
// etc
import handle422 from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'
import ucWords from '@/utils/ucWords'

let getRowData: GetRowDataType<Payroll>

export default function FinancesPayrollsEmployees() {
    const { push } = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleNew = () => {
        setIsDialogOpen(true)
    }

    const handleClose = () => {
        setIsDialogOpen(false)
    }

    return (
        <AuthLayout title="Penggajian Karyawan">
            <Datatable
                title="Riwayat"
                tableId="product-purchases-table"
                apiUrl={FinanceApiUrlEnum.PAYROLL_DATATABLE_DATA}
                apiUrlParams={{
                    type: 'employee',
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
                // onRowClick={handleRowClick}
                getRowDataCallback={fn => (getRowData = fn)}
                // mutateCallback={fn => (mutate = fn)}
            />

            <DialogWithTitle title="Tambah Data Penggajian" open={isDialogOpen}>
                <Formik
                    initialValues={{}}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post<UUID>(
                                FinanceApiUrlEnum.CREATE_PAYROLL,
                                values,
                            )
                            .then(res =>
                                push(
                                    `/finances/payrolls/employees/${res.data}`,
                                ),
                            )
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={FinancesPayrollsForm}
                />
            </DialogWithTitle>

            <Fab onClick={handleNew}>
                <PaymentsIcon />
            </Fab>
        </AuthLayout>
    )
}

function DetailButton({ uuid: payrollUuid }: { uuid: UUID }) {
    return (
        <IconButton href={`/finances/payrolls/employees/${payrollUuid}`}>
            <VisibilityIcon />
        </IconButton>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Payroll>['columns'] = [
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'type',
        label: 'Jenis',
        options: {
            customBodyRender: ucWords,
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },
    {
        name: 'earning_rp_cache',
        label: 'Total Gaji Kotor',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
    {
        name: 'deduction_rp_cache',
        label: 'Total Potongan',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
    {
        name: 'final_rp_cache',
        label: 'Total Gaji Bersih',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: number) => (
                <Box
                    color={value <= 0 ? 'error.main' : undefined}
                    component="span">
                    {numberToCurrency(value)}
                </Box>
            ),
        },
    },
    {
        name: 'processedByUser.name',
        label: 'Diproses Oleh',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)

                return data ? data.processed_by_user?.name : '-'
            },
        },
    },
    {
        name: 'uuid',
        label: 'Rincian',
        options: {
            filter: false,
            sort: false,
            searchable: false,
            customBodyRender: (uuid: UUID) => <DetailButton uuid={uuid} />,
        },
    },
]
