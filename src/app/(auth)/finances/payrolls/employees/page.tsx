'use client'

// icons
import PaymentsIcon from '@mui/icons-material/Payments'
import VisibilityIcon from '@mui/icons-material/Visibility'
// materials
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
// types
import type { UUID } from 'crypto'
// vendors
import { Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
import FinancesPayrollsForm from '@/app/(auth)/finances/payrolls/employees/_parts/Form'
// components
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
} from '@/components/data-table'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import PageTitle from '@/components/page-title'
import axios from '@/lib/axios'
import type Payroll from '@/types/orms/payroll'
// etc
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import ucWords from '@/utils/uc-words'

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
        <>
            <PageTitle title="Penggajian Karyawan" />

            <Datatable
                apiUrl={FinanceApiUrlEnum.PAYROLL_DATATABLE_DATA}
                apiUrlParams={{
                    type: 'employee',
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowData = fn)}
                tableId="product-purchases-table"
                // onRowClick={handleRowClick}
                title="Riwayat"
                // mutateCallback={fn => (mutate = fn)}
            />

            <DialogWithTitle open={isDialogOpen} title="Tambah Data Penggajian">
                <Formik
                    component={FinancesPayrollsForm}
                    initialValues={{}}
                    onReset={handleClose}
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
                />
            </DialogWithTitle>

            <Fab onClick={handleNew}>
                <PaymentsIcon />
            </Fab>
        </>
    )
}

function DetailButton({ uuid: payrollUuid }: { uuid: UUID }) {
    return (
        <IconButton href={`/finances/payrolls/employees/${payrollUuid}`}>
            <VisibilityIcon />
        </IconButton>
    )
}

const DATATABLE_COLUMNS: DataTableProps<Payroll>['columns'] = [
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender: (_, rowIndex) => {
                return getRowData(rowIndex)?.short_uuid ?? '-'
            },
        },
    },
    {
        label: 'Jenis',
        name: 'type',
        options: {
            customBodyRender: ucWords,
        },
    },
    {
        label: 'Catatan',
        name: 'note',
    },
    {
        label: 'Total Gaji Kotor',
        name: 'earning_rp_cache',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Total Potongan',
        name: 'deduction_rp_cache',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Total Gaji Bersih',
        name: 'final_rp_cache',
        options: {
            customBodyRender: (value: number) => (
                <Box
                    color={value <= 0 ? 'error.main' : undefined}
                    component="span">
                    {numberToCurrency(value)}
                </Box>
            ),
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Diproses Oleh',
        name: 'processedByUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)

                return data ? data.processed_by_user?.name : '-'
            },
        },
    },
    {
        label: 'Rincian',
        name: 'uuid',
        options: {
            customBodyRender: (uuid: UUID) => <DetailButton uuid={uuid} />,
            filter: false,
            searchable: false,
            sort: false,
        },
    },
]
