'use client'

import type Payroll from '@/dataTypes/Payroll'
// vendors
import { useParams } from 'next/navigation'
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
import AddCircleIcon from '@mui/icons-material/AddCircle'
import BackButton from '@/components/back-button'
import IconButton from '@/components/IconButton'
import InfoBox from '@/components/InfoBox'
import LoadingCenter from '@/components/loading-center'
import PrintHandler from '@/components/PrintHandler'
// parts
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
import PayrollUsersForm from '@/app/(auth)/finances/payrolls/employees/[uuid]/_parts/payroll-users'
import PayrollsEmployeesTable from '@/app/(auth)/finances/payrolls/employees/_parts/employees/Table'
import ProcessPayrollForm from '@/app/(auth)/finances/payrolls/employees/[uuid]/_parts/process-payroll'
import PayrollDeleteForm from '@/app/(auth)/finances/payrolls/employees/[uuid]/_parts/delete'
// utils
import toDmy from '@/utils/to-dmy'
import numberToCurrency from '@/utils/number-to-currency'

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
                    <Box display="flex" gap={1} alignItems="center">
                        {!data.processed_at && (
                            <PayrollDeleteForm
                                disabled={false}
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
                                    isSwrLoading={false}
                                    disabled={false}
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
                isSwrLoading={false}
                disabled={false}
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
