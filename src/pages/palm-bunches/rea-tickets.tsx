import Head from 'next/head'

import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesReaTickets() {
    return (
        <AuthLayout title="Daftar Tiket REA">
            <Head>
                <title>{`Daftar Tiket REA — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'

import { FC, useState } from 'react'
import moment from 'moment'
import 'moment/locale/id'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'

import ReceiptIcon from '@mui/icons-material/Receipt'

import Datatable, { getDataRow, mutate } from '@/components/Global/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'

import MainForm from '@/components/PalmBunchesReaTicket/Form'
import useFormData from '@/providers/useFormData'
import NumericFormat from '@/components/Global/NumericFormat'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'

const Crud: FC = () => {
    const [filter, setFilter] = useState<string | undefined>()

    const {
        data,
        formOpen,
        isNew,
        handleClose,
        handleCreate,
        handleEdit,
        loading,
        setData,
        setSubmitting,
        submitting,
    } = useFormData<PalmBunchesReaTicketType>()

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
                    getDataRow<PalmBunchesReaTicketType>(rowMeta.rowIndex)
                        .delivery.to_oil_mill_code,
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
                    const courier_user = getDataRow<PalmBunchesReaTicketType>(
                        rowMeta.rowIndex,
                    ).delivery.courier_user

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
                        {getDataRow<PalmBunchesReaTicketType>(
                            rowMeta.rowIndex,
                        ).delivery.palm_bunches.map(
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
                        value={
                            getDataRow<PalmBunchesReaTicketType>(
                                rowMeta.rowIndex,
                            ).delivery.n_bunches
                        }
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
                        value={
                            getDataRow<PalmBunchesReaTicketType>(
                                rowMeta.rowIndex,
                            ).delivery.n_kg
                        }
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

            <Dialog
                title={`${isNew ? 'Masukkan' : 'Perbarui'} Data Pengangkutan`}
                maxWidth="lg"
                open={formOpen}
                closeButtonProps={{
                    onClick: handleClose,
                }}
                middleHead={
                    <FormDataDraftsCrud
                        modelName="PalmBuncesReaTicket"
                        dataKeyForNameId="ticket_no"
                    />
                }>
                <MainForm
                    data={data}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    onSubmitted={() => {
                        mutate()
                        handleClose()
                    }}
                    actionsSlot={
                        <FormActions
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                    onChange={setData}
                />
            </Dialog>

            <Fab
                disabled={formOpen}
                onClick={handleCreate}
                color="success"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <ReceiptIcon />
            </Fab>
        </>
    )
}
