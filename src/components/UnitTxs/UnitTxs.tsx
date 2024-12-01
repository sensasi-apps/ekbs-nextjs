// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type { GetRowDataType, MutateType } from '@/components/Datatable'
import type Transaction from '@/dataTypes/Transaction'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'
// materials
import { Box, Chip, Unstable_Grid2 as Grid2, Tooltip } from '@mui/material'
import { green } from '@mui/material/colors'
// components
import Datatable, { getNoWrapCellProps } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import UnitTxForm from './Form'
import BigNumber from '@/components/StatCard/BigNumber'
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// utils
import formatNumber from '@/utils/formatNumber'
import handle422 from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'
// enums
import BusinessUnit from '@/enums/BusinessUnit'

let getRowData: GetRowDataType<Transaction>
let mutate: MutateType<Transaction>

export default function UnitTxs({
    businessUnit,
}: {
    businessUnit: BusinessUnit
}) {
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    function handleClose() {
        setIsOpenDialog(false)
    }

    const { data, isLoading } = useSWR<{
        balance: number
        receivable: number
        receivable_pass_due: number
        in_out_balance: InOutLineChartProps['data']
    }>(getStatApiUrl(businessUnit))

    return (
        <>
            <Grid2 container mb={1} spacing={1.5}>
                <Grid2
                    xs={12}
                    sm={4}
                    display="flex"
                    flexDirection="column"
                    gap={1.5}>
                    <BigNumber
                        title="Saldo Unit"
                        primary={
                            <Tooltip
                                title={numberToCurrency(data?.balance ?? 0)}
                                arrow
                                placement="top">
                                <Box component="span">
                                    {numberToCurrency(data?.balance ?? 0, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </Tooltip>
                        }
                        isLoading={isLoading}
                    />
                </Grid2>

                <Grid2 xs={12} sm={8}>
                    <StatCard
                        title="Saldo Keluar-Masuk — Bulanan"
                        isLoading={isLoading}>
                        <InOutLineChart data={data?.in_out_balance} />
                    </StatCard>
                </Grid2>
            </Grid2>

            <Datatable
                title="Riwayat Transaksi"
                tableId="transaction-datatable"
                apiUrl={`/transactions/${businessUnit}/datatable`}
                columns={
                    businessUnit
                        ? DATATABLE_COLUMNS.filter(
                              col => col.name !== 'cash.name',
                          )
                        : DATATABLE_COLUMNS
                }
                defaultSortOrder={{ name: 'uuid', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
            />

            <DialogWithTitle title="Tambah Transaksi" open={isOpenDialog}>
                <Formik
                    initialValues={{}}
                    initialStatus={{
                        businessUnit: businessUnit,
                    }}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `transactions/business-unit/${businessUnit}`,
                                values,
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={UnitTxForm}
                />
            </DialogWithTitle>

            <Fab
                onClick={() => setIsOpenDialog(true)}
                disabled={isOpenDialog}
                aria-label="Tambah transaksi">
                <PaymentsIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: 'excluded',
        },
    },
    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'at',
        label: 'TGL',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRender: toDmy,
        },
    },
    {
        name: 'tags.name',
        label: 'Akun',
        options: {
            sort: false,
            customBodyRenderLite: (dataIndex: number) =>
                getRowData(dataIndex)?.tags.map(tag => (
                    <Chip size="small" label={tag.name.id} key={tag.id} />
                )),
        },
    },
    {
        name: 'amount',
        label: 'Nilai (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        color: value <= 0 ? 'inherit' : green[500],
                    }}>
                    {formatNumber(value)}
                </span>
            ),
        },
    },
    {
        name: 'desc',
        label: 'Keterangan',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'pre',
                },
            }),
        },
    },
    {
        name: 'userActivityLogs.user.name',
        label: 'Oleh',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.user_activity_logs?.[0]?.user.name,
        },
    },
]

function getStatApiUrl(businessUnit: BusinessUnit) {
    switch (businessUnit) {
        case BusinessUnit.SPP:
            return 'user-loans/statistic-data'
            break

        case BusinessUnit.SAPRODI:
            return 'farm-inputs/statistic-data'
            break

        case BusinessUnit.ALAT_BERAT:
            return 'heavy-equipment-rents/statistic-data'
            break

        case BusinessUnit.TBS:
            return 'palm-bunches/statistic-data'
            break

        default:
            throw new Error('business unit unhandled')
            break
    }
}
