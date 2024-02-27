import type Payroll from '@/dataTypes/Payroll'
// vendors
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import SettingsIcon from '@mui/icons-material/Settings'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import FinanceApiUrlEnum from '@/components/pages/finances/ApiUrlEnum'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import BackButton from '@/components/BackButton'
import PayrollUsersForm from '@/components/pages/finances/Forms/PayrollUsers'
import PayrollsEmployeesTable from '@/components/pages/finances/payrolls/employees/Table'
import InfoBox from '@/components/InfoBox'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import ProcessPayrollForm from '@/components/pages/finances/Forms/ProcessPayroll'
import PayrollDeleteForm from '@/components/pages/finances/Forms/Delete'
import PrintHandler from '@/components/PrintHandler'

export default function Test() {
    const {
        query: { uuid: uuidQuery },
        isReady,
    } = useRouter()

    const [processDialogOpen, setProcessDialogOpen] = useState(false)

    const { data, isLoading, mutate, isValidating } = useSWR<Payroll>(
        uuidQuery
            ? FinanceApiUrlEnum.READ_PAYROLL.replace(
                  '$uuid',
                  uuidQuery as string,
              )
            : null,
    )

    const isSwrLoading = isLoading || isValidating
    const disabled =
        !isReady || isSwrLoading || Boolean(data?.processed_by_user)

    return (
        <AuthLayout title="Rincian Penggajian">
            <BackButton />

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h4">Rincian Penggajian</Typography>

                {data && !data.processed_at && (
                    <Box>
                        <PayrollDeleteForm
                            disabled={disabled}
                            uuid={data.uuid}
                        />

                        <Button
                            disabled={disabled}
                            variant="contained"
                            startIcon={<SettingsIcon />}
                            size="small"
                            sx={{
                                m: 1,
                            }}
                            onClick={() => setProcessDialogOpen(true)}>
                            Proses
                        </Button>

                        <Dialog
                            open={processDialogOpen}
                            maxWidth="sm"
                            fullWidth>
                            <DialogContent>
                                <ProcessPayrollForm
                                    data={data}
                                    mutate={mutate}
                                    handleClose={() =>
                                        setProcessDialogOpen(false)
                                    }
                                />
                            </DialogContent>
                        </Dialog>
                    </Box>
                )}

                {data?.processed_at && (
                    <PrintHandler>
                        <Typography variant="h4">Rincian Penggajian</Typography>

                        <MainContent
                            data={data}
                            mutate={mutate}
                            isSwrLoading={isSwrLoading}
                            disabled={disabled}
                        />
                    </PrintHandler>
                )}
            </Box>

            <MainContent
                data={data}
                mutate={mutate}
                isSwrLoading={isSwrLoading}
                disabled={disabled}
            />
        </AuthLayout>
    )
}

function MainContent({
    data,
    mutate,
    isSwrLoading,
    disabled,
}: {
    data: Payroll | undefined
    mutate: () => void
    isSwrLoading: boolean
    disabled: boolean
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <InfoBox
                loading={isSwrLoading}
                data={[
                    {
                        label: 'Kode',
                        value: data?.short_uuid ?? '',
                    },
                    {
                        label: 'Tanggal Penggajian',
                        value: data?.at ? toDmy(data.at) : '',
                    },
                    {
                        label: 'Catatan',
                        value: data?.note ?? '',
                    },
                    {
                        label: 'Jumlah Penerima',
                        value:
                            (data?.users?.length.toString() ?? '0') + ' Orang',
                    },
                    {
                        label: 'Penerimaan Kotor',
                        value: numberToCurrency(data?.earning_rp_cache ?? 0),
                    },
                    {
                        label: 'Potongan',
                        value: numberToCurrency(data?.deduction_rp_cache ?? 0),
                    },
                    {
                        label: 'Total Bersih',
                        value: numberToCurrency(data?.final_rp_cache ?? 0),
                    },
                    {
                        label: 'Diproses pada',
                        value: data?.processed_at
                            ? toDmy(data.processed_at)
                            : '',
                    },
                    {
                        label: 'Diproses oleh',
                        value: data?.processed_by_user?.name ?? '',
                    },
                ]}
            />

            <Box display="flex" mt={3}>
                <Typography variant="h6">Daftar Penerima</Typography>

                {!data?.processed_by_user_uuid && (
                    <>
                        <Tooltip placement="top" arrow title="Tambah">
                            <span>
                                <IconButton
                                    disabled={disabled}
                                    color="success"
                                    size="small"
                                    onClick={() => setOpen(true)}>
                                    <AddCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>

                        {data?.uuid && (
                            <Dialog open={open} maxWidth="xs" fullWidth>
                                <DialogTitle>Tambah Penerima</DialogTitle>
                                <DialogContent>
                                    <PayrollUsersForm
                                        onClose={() => {
                                            mutate()
                                            setOpen(false)
                                        }}
                                        payrollUuid={data.uuid}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                    </>
                )}
            </Box>

            <PayrollsEmployeesTable
                loading={isSwrLoading}
                data={data}
                mutate={mutate}
            />
        </>
    )
}
