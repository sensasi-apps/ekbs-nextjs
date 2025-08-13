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
import Typography from '@mui/material/Typography'
// icons
import SettingsIcon from '@mui/icons-material/Settings'
import VisibilityIcon from '@mui/icons-material/Visibility'
// components
import AuthLayout from '@/components/auth-layout'
import FinanceApiUrlEnum from '@/components/pages/finances/ApiUrlEnum'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import BackButton from '@/components/back-button'
import PayrollUsersForm from '@/components/pages/finances/Forms/PayrollUsers'
import PayrollsEmployeesTable from '@/components/pages/finances/payrolls/employees/Table'
import InfoBox from '@/components/InfoBox'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import ProcessPayrollForm from '@/components/pages/finances/Forms/ProcessPayroll'
import PayrollDeleteForm from '@/components/pages/finances/Forms/Delete'
import PrintHandler from '@/components/PrintHandler'
import IconButton from '@/components/IconButton'

export default function FinancePayrollEmployee() {
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
    const disabled = !isReady || isSwrLoading

    return (
        <AuthLayout title="Rincian Penggajian">
            <BackButton />

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h4">
                    Rincian Penggajian{' '}
                    {data?.type
                        ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
                        : ''}
                </Typography>

                {data && (
                    <Box display="flex" gap={1} alignItems="center">
                        {!data.processed_at && (
                            <PayrollDeleteForm
                                disabled={disabled}
                                uuid={data.uuid}
                            />
                        )}

                        {data.processed_at ? (
                            <IconButton
                                title="Lihat rincian pembagian beban"
                                icon={VisibilityIcon}
                                onClick={() => setProcessDialogOpen(true)}
                            />
                        ) : (
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
                        )}

                        {data?.processed_at && (
                            <PrintHandler>
                                <Typography variant="h4">
                                    Rincian Penggajian
                                </Typography>

                                <MainContent
                                    data={data}
                                    mutate={mutate}
                                    isSwrLoading={isSwrLoading}
                                    disabled={disabled}
                                />
                            </PrintHandler>
                        )}

                        <Dialog
                            open={processDialogOpen}
                            maxWidth="lg"
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
                        value: data?.short_uuid,
                    },
                    {
                        label: 'Tanggal Penggajian',
                        value: data?.at ? toDmy(data.at) : '',
                    },
                    {
                        label: 'Jenis',
                        value: data?.type
                            ? data.type.charAt(0).toUpperCase() +
                              data.type.slice(1)
                            : '',
                    },
                    {
                        label: 'Catatan',
                        value: data?.note,
                    },
                    {
                        label: 'Jumlah Penerima',
                        value:
                            (data?.users?.length.toString() ?? '0') + ' Orang',
                    },
                    {
                        label: 'Total Gaji Kotor',
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
                        value: data?.processed_by_user?.name,
                    },
                ]}
            />

            <Box display="flex" mt={3}>
                <Typography variant="h6">Daftar Penerima</Typography>

                {!data?.processed_by_user_uuid && (
                    <>
                        <IconButton
                            disabled={disabled}
                            color="success"
                            onClick={() => setOpen(true)}
                            icon={AddCircleIcon}
                            title="Tambah"
                        />

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
