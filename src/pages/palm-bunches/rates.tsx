import moment from 'moment'
import Head from 'next/head'

import AuthLayout from '@/components/Layouts/AuthLayout'

import { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesRates() {
    return (
        <AuthLayout title="Harga Sawit">
            <Head>
                <title>{`Harga Sawit — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import type PalmBunchRateValidDateType from '@/dataTypes/PalmBunchRateValidDate'

import { NumericFormat } from 'react-number-format'

import Fab from '@mui/material/Fab'

import SellIcon from '@mui/icons-material/Sell'
// providers
import useFormData from '@/providers/useFormData'
// components
import Datatable, { getDataRow, mutate } from '@/components/Global/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'
import PalmBunchRatesForm from '@/components/PalmBunchRates/Form'
// libs
import weekOfMonths from '@/lib/weekOfMonth'

const nameIdFormatter = (validFrom: string) => {
    const momentValue = moment(validFrom)

    return `${momentValue.format('MMMM ')}#${weekOfMonths(momentValue)}`
}

const Crud = () => {
    const {
        formOpen,
        handleClose,
        handleCreate,
        handleEdit,
        isNew,
        isDirty,
        loading,
    } = useFormData<PalmBunchRateValidDateType>()

    const columns = [
        {
            name: 'id',
            label: 'NO',
        },
        {
            name: 'for_human_name',
            label: 'Nama',
        },
        {
            name: 'valid_from',
            label: 'Tanggal Berlaku',
            options: {
                customBodyRender: (value: Date) =>
                    moment(value).format('DD MMMM YYYY'),
            },
        },
        {
            name: 'valid_until',
            label: 'Tanggal Berakhir',
            options: {
                customBodyRender: (value: Date) =>
                    moment(value).format('DD MMMM YYYY'),
            },
        },
        {
            name: 'rates',
            label: 'Harga',
            searchable: false,
            options: {
                searchable: false,
                sort: false,
                customBodyRender: (value: any) => (
                    <NumericFormat
                        value={value[0].rp_per_kg}
                        prefix="Rp "
                        thousandSeparator="."
                        decimalSeparator=","
                        displayType="text"
                    />
                ),
            },
        },
    ]

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/rates/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
                onRowClick={(_, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                tableId="PalmBunchRateValidDate"
                title="Daftar Harga TBS"
            />
            <Dialog
                title={isNew ? 'Harga Baru' : 'Ubah Harga'}
                maxWidth="md"
                open={formOpen}
                closeButtonProps={{
                    onClick: () => {
                        if (
                            isDirty &&
                            !window.confirm(
                                'Perubahan belum tersimpan, yakin ingin menutup?',
                            )
                        ) {
                            return
                        }

                        return handleClose()
                    },
                    disabled: loading,
                }}
                middleHead={
                    <FormDataDraftsCrud
                        modelName="PalmBunchRateValidDate"
                        dataKeyForNameId="valid_from"
                        nameIdFormatter={nameIdFormatter}
                    />
                }>
                <PalmBunchRatesForm parentDatatableMutator={mutate} />
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
                <SellIcon />
            </Fab>
        </>
    )
}
