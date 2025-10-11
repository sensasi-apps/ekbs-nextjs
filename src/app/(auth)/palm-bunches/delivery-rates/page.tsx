'use client'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

export default function PalmBunchesDeliveryRates() {
    return (
        <>
            <PageTitle title="Tarif Angkut" />
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </>
    )
}

import SellIcon from '@mui/icons-material/Sell'
// vendors
import Fab from '@mui/material/Fab'
// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import PalmBunchDeliveryRatesForm from '@/components/PalmBunchDeliveryRates/Form'
import PageTitle from '@/components/page-title'
import type PalmBunchDeliveryRateORM from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate'
// types
import type PalmBunchDeliveryRateValidDateType from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate-valid-date'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import toDmy from '@/utils/to-dmy'

function Crud() {
    const {
        data,
        formOpen,
        handleClose,
        handleCreate,
        handleEdit,
        isNew,
        isDirty,
        loading,
        setData,
        setSubmitting,
        submitting,
    } = useFormData<PalmBunchDeliveryRateValidDateType>()

    const columns = [
        {
            label: 'ID',
            name: 'id',
        },
        {
            label: 'Nama',
            name: 'for_human_name',
        },
        {
            label: 'Tanggal Berlaku',
            name: 'valid_from',
            options: {
                customBodyRender: toDmy,
            },
        },
        {
            label: 'Tanggal Berakhir',
            name: 'valid_until',
            options: {
                customBodyRender: toDmy,
            },
        },
        {
            label: 'Harga',
            name: 'delivery_rates',
            options: {
                customBodyRender: (rates: PalmBunchDeliveryRateORM[]) => (
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '1em',
                        }}>
                        {rates.map(rate => (
                            <li key={rate.id}>
                                {rate.to_oil_mill_code} {rate.from_position}:{' '}
                                {numberToCurrency(rate.rp_per_kg)}
                            </li>
                        ))}
                    </ul>
                ),
                searchable: false,
                sort: false,
            },
            searchable: false,
        },
    ]

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/delivery-rates/datatable"
                columns={columns}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getRowData<PalmBunchDeliveryRateValidDateType>(
                                dataIndex,
                            )

                        if (data) {
                            handleEdit(data)
                        }
                    }
                }}
                tableId="PalmBunchDeliveryRateDatatable"
                title="Daftar Tarif Angkut"
            />
            <Dialog
                closeButtonProps={{
                    disabled: loading,
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
                }}
                maxWidth="md"
                open={formOpen}
                title={isNew ? 'Tarif Baru' : 'Ubah Tarif'}>
                <PalmBunchDeliveryRatesForm
                    actionsSlot={
                        <FormActions
                            onCancel={() => {
                                if (
                                    isDirty &&
                                    !window.confirm(
                                        'Perubahan belum tersimpan, yakin ingin membatalkan?',
                                    )
                                ) {
                                    return
                                }

                                return handleClose()
                            }}
                            submitting={submitting}
                        />
                    }
                    data={data}
                    loading={loading}
                    onChange={setData}
                    onSubmitted={async () => {
                        await mutate()
                        setSubmitting(false)
                        handleClose()
                    }}
                    setSubmitting={setSubmitting}
                />
            </Dialog>
            <Fab
                color="success"
                disabled={formOpen}
                onClick={handleCreate}
                sx={{
                    bottom: 16,
                    position: 'fixed',
                    right: 16,
                }}>
                <SellIcon />
            </Fab>
        </>
    )
}
