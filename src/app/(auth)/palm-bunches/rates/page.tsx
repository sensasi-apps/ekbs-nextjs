'use client'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

export default function PalmBunchesRates() {
    return (
        <>
            <PageTitle title="Harga Sawit" />

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </>
    )
}

import SellIcon from '@mui/icons-material/Sell'
// vendors
import Fab from '@mui/material/Fab'
import PalmBunchRatesForm from '@/app/(auth)/palm-bunches/rates/palm-bunch-rates-form'
// components
import Datatable, { getRowData, mutate } from '@/components/data-table'
import Dialog from '@/components/Global/Dialog'
import PageTitle from '@/components/page-title'
// types
import type PalmBunchRateType from '@/modules/palm-bunch/types/orms/palm-bunch-rate'
import type PalmBunchRateValidDateType from '@/modules/palm-bunch/types/orms/palm-bunch-rate-valid-date'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import toDmy from '@/utils/to-dmy'

function Crud() {
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
            label: 'NO',
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
            name: 'rates',
            options: {
                customBodyRender: (value: PalmBunchRateType[]) =>
                    value[0].rp_per_kg
                        ? numberToCurrency(value[0].rp_per_kg)
                        : '-',
                searchable: false,
                sort: false,
            },
            searchable: false,
        },
    ]

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/rates/datatable"
                columns={columns}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                onRowClick={(_, { rowIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getRowData<PalmBunchRateValidDateType>(rowIndex)
                        if (!data) return

                        handleEdit(data)
                    }
                }}
                tableId="PalmBunchRateValidDate"
                title="Daftar Harga TBS"
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
                title={isNew ? 'Harga Baru' : 'Ubah Harga'}>
                <PalmBunchRatesForm parentDatatableMutator={mutate} />
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
