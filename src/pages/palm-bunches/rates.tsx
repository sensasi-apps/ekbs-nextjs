import AuthLayout from '@/components/Layouts/AuthLayout'
import { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesRates() {
    return (
        <AuthLayout title="Harga Sawit">
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

// types
import type PalmBunchRateValidDateType from '@/dataTypes/PalmBunchRateValidDate'
// vendors
import Fab from '@mui/material/Fab'
import SellIcon from '@mui/icons-material/Sell'
// providers
import useFormData from '@/providers/useFormData'
// components
import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import PalmBunchRatesForm from '@/components/PalmBunchRates/Form'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'

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
                customBodyRender: toDmy,
            },
        },
        {
            name: 'valid_until',
            label: 'Tanggal Berakhir',
            options: {
                customBodyRender: toDmy,
            },
        },
        {
            name: 'rates',
            label: 'Harga',
            searchable: false,
            options: {
                searchable: false,
                sort: false,
                customBodyRender: (value: any) =>
                    numberToCurrency(value[0].rp_per_kg),
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
                }}>
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
