'use client'

// components
import AddCircleIcon from '@mui/icons-material/AddCircle'
// icons
import SettingsIcon from '@mui/icons-material/Settings'
import VisibilityIcon from '@mui/icons-material/Visibility'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
// vendors
import { useParams } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
// parts
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
import PayrollsEmployeesTable from '@/app/(auth)/finances/payrolls/employees/_parts/employees/Table'
import PayrollDeleteForm from '@/app/(auth)/finances/payrolls/employees/[uuid]/_parts/delete'
import PayrollUsersForm from '@/app/(auth)/finances/payrolls/employees/[uuid]/_parts/payroll-users'
import ProcessPayrollForm from '@/app/(auth)/finances/payrolls/employees/[uuid]/_parts/process-payroll'
import BackButton from '@/components/back-button'
import InfoBox from '@/components/InfoBox'
import IconButton from '@/components/icon-button'
import LoadingCenter from '@/components/loading-center'
import PrintHandler from '@/components/print-handler'
import type Payroll from '@/types/orms/payroll'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import toDmy from '@/utils/to-dmy'

export default function FinancePayrollEmployee() {
    const params = useParams()

    const [processDialogOpen, setProcessDialogOpen] = useState(false)

    const { data, isLoading, mutate, isValidating } = useSWR<Payroll>(
        params?.uuid
            ? FinanceApiUrlEnum.READ_PAYROLL.replace(
                  '$uuid',
                  params.uuid as string,
              )
            : null,
    )

    if (isLoading || isValidating) return <LoadingCenter />

    return (
        <>
            <BackButton />

            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h4">
                    Rincian Penggajian{' '}
                    {data?.type
                        ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
                        : ''}
                </Typography>

                {data && (
                    <Box alignItems="center" display="flex" gap={1}>
                        {!data.processed_at && (
                            <PayrollDeleteForm
                                disabled={false}
                                uuid={data.uuid}
                            />
                        )}

                        {data.processed_at ? (
                            <IconButton
                                icon={VisibilityIcon}
                                onClick={() => setProcessDialogOpen(true)}
                                title="Lihat rincian pembagian beban"
                            />
                        ) : (
                            <Button
                                onClick={() => setProcessDialogOpen(true)}
                                size="small"
                                startIcon={<SettingsIcon />}
                                sx={{
                                    m: 1,
                                }}
                                variant="contained">
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
                                    disabled={false}
                                    isSwrLoading={false}
                                    mutate={mutate}
                                />
                            </PrintHandler>
                        )}

                        <Dialog
                            fullWidth
                            maxWidth="lg"
                            open={processDialogOpen}>
                            <DialogContent>
                                <ProcessPayrollForm
                                    data={data}
                                    handleClose={() =>
                                        setProcessDialogOpen(false)
                                    }
                                    mutate={mutate}
                                />
                            </DialogContent>
                        </Dialog>
                    </Box>
                )}
            </Box>

            <MainContent
                data={data}
                disabled={false}
                isSwrLoading={false}
                mutate={mutate}
            />
        </>
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
                loading={isSwrLoading}
            />

            <Box display="flex" mt={3}>
                <Typography variant="h6">Daftar Penerima</Typography>

                {!data?.processed_by_user_uuid && (
                    <>
                        <IconButton
                            color="success"
                            disabled={disabled}
                            icon={AddCircleIcon}
                            onClick={() => setOpen(true)}
                            title="Tambah"
                        />

                        {data?.uuid && (
                            <Dialog fullWidth maxWidth="xs" open={open}>
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
                data={data}
                loading={isSwrLoading}
                mutate={mutate}
            />
        </>
    )
}
