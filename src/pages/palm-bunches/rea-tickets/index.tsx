import { FC, useState } from 'react'
import Head from 'next/head'
import moment from 'moment'
import { mutate } from 'swr'
import 'moment/locale/id'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import ReceiptIcon from '@mui/icons-material/Receipt'

import AuthLayout from '@/components/Layouts/AuthLayout'

import FabWithUseFormData from '@/components/Global/Fab/WithUseFormData'
import Datatable, { getDataRow } from '@/components/Global/Datatable'
import FormActionsBox from '@/components/Global/FormActionsBox'
import DialogWithUseFormData from '@/components/Global/Dialog/WithUseFormData'

import MainForm from '@/components/PalmBunchesReaTicket/Form/index'
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import PalmBunchesReaTicketDataType from '@/dataTypes/PalmBunchReaTicket'
import NumericFormat from '@/components/Global/NumericFormat'

const PalmBuncesReaTicketsPage: FC = () => {
    return (
        <AuthLayout title="Daftar Tiket REA">
            <Head>
                <title>{`Daftar Tiket REA — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <PalmBunchesReaTicketsCrudWithUseFormData />
            </FormDataProvider>
        </AuthLayout>
    )
}

export default PalmBuncesReaTicketsPage

const PalmBunchesReaTicketsCrudWithUseFormData: FC = () => {
    const [filter, setFilter] = useState<string | undefined>()

    const {
        data,
        submitting,
        loading,
        isNew,
        setSubmitting,
        handleClose,
        handleEdit,
    } = useFormData()

    const columns = [
        {
            name: 'id',
            label: 'id',
        },
        {
            name: 'at',
            label: 'Tanggal',
            options: {
                customBodyRender: (value: string) => moment(value).format('LL'),
            },
        },
        {
            name: 'delivery.to_oil_mill_code',
            label: 'Pabrik',
            options: {
                customBodyRender: (_: any, rowMeta: any) =>
                    getDataRow(rowMeta.rowIndex).delivery.to_oil_mill_code,
            },
        },
        {
            name: 'ticket_no',
            label: 'NO. Tiket',
        },
        {
            name: 'delivery.courierUser.name',
            label: 'Pengangkut',
            options: {
                customBodyRender: (_: any, rowMeta: any) => {
                    const courier_user = getDataRow(rowMeta.rowIndex).delivery
                        .courier_user

                    return `#${courier_user.id} ${courier_user.name}`
                },
            },
        },
        {
            name: 'delivery.palm_bunches.owner_user.name',
            label: 'Pemilik TBS',
            options: {
                sort: false,
                customBodyRender: (_: any, rowMeta: any) => (
                    <ul
                        style={{
                            padding: 0,
                            margin: 0,
                        }}>
                        {getDataRow(rowMeta.rowIndex).delivery.palm_bunches.map(
                            (palmBunches: any, index: number) => (
                                <li
                                    key={index}
                                    style={{ marginBottom: `.5em` }}>
                                    #{palmBunches.owner_user.id + ' '}
                                    {palmBunches.owner_user.name + ' '}(
                                    {palmBunches.n_kg} kg)
                                </li>
                            ),
                        )}
                    </ul>
                ),
            },
        },
        {
            name: 'delivery.n_bunches',
            label: 'Janjang',
            options: {
                customBodyRender: (_: any, rowMeta: any) => (
                    <NumericFormat
                        value={getDataRow(rowMeta.rowIndex).delivery.n_bunches}
                        displayType="text"
                    />
                ),
            },
        },
        {
            name: 'delivery.n_kg',
            label: 'Bobot',
            options: {
                customBodyRender: (_: any, rowMeta: any) => (
                    <NumericFormat
                        value={getDataRow(rowMeta.rowIndex).delivery.n_kg}
                        suffix=" kg"
                        displayType="text"
                    />
                ),
            },
        },
        {
            name: 'net_rp',
            label: 'Pembayaran REA',
            options: {
                sort: false,
                customBodyRender: (value: null | number) => {
                    if (value === null) return '-'

                    return (
                        <NumericFormat
                            value={value}
                            prefix="Rp. "
                            displayType="text"
                        />
                    )
                },
            },
        },
        {
            name: 'status',
            label: 'Status',
            options: {
                sort: false,
                customBodyRender: (value: string) => (
                    <Typography
                        color={
                            value === 'Lunas' ? 'success.main' : 'warning.main'
                        }
                        variant="body2"
                        component="div">
                        {value}
                    </Typography>
                ),
            },
        },
    ]

    return (
        <>
            <Box
                sx={{
                    overflowX: 'auto',
                }}
                mb={3}
                display="flex"
                gap={1}>
                <Chip
                    label="Semua"
                    color={filter === undefined ? 'success' : undefined}
                    onClick={() => setFilter(undefined)}
                />

                <Chip
                    label="Data pembayaran tidak cocok"
                    color={
                        filter === 'filter=unmatched' ? 'success' : undefined
                    }
                    onClick={() => setFilter('filter=unmatched')}
                />

                <Chip
                    label="Data pembayaran tidak ditemukan"
                    color={
                        filter === 'filter=not-found' ? 'success' : undefined
                    }
                    onClick={() => setFilter('filter=not-found')}
                />
            </Box>

            <Datatable
                title="Riwayat"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl={'/palm-bunches/rea-tickets/datatable?' + (filter || '')}
                onRowClick={(_, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                columns={columns}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
            />

            <DialogWithUseFormData
                title={`${isNew ? 'Masukkan' : 'Perbarui'} Data Pengangkutan`}
                maxWidth="lg">
                <MainForm
                    data={data as PalmBunchesReaTicketDataType}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    handleClose={() => {
                        mutate(
                            '/palm-bunches/rea-tickets/datatable?' +
                                (filter || ''),
                        )
                        handleClose()
                    }}
                    actionsSlot={
                        <FormActionsBox
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                />
            </DialogWithUseFormData>

            <FabWithUseFormData>
                <ReceiptIcon />
            </FabWithUseFormData>
        </>
    )
}
