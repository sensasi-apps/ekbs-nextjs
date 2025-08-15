'use client'

// vendors
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
import myAxios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// components
import type User from '@/features/user/types/user'
import DataTableV2, { type DataTableV2Props } from '@/components/datatable-v2'
import Fab from '@/components/Fab'
import UserSelect from '@/components/FormikForm/user-select'
import TextShortener from '@/components/text-shortener'
import PageTitle from '@/components/page-title'
// utils
import handle422 from '@/utils/handle-422'

interface Member {
    user_uuid: string
    user: User
}

export default function Members() {
    const [open, setOpen] = useState(false)

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            <PageTitle title="Anggota Sertifikasi" />

            <DataTableV2
                columns={columns}
                url="/api/clm/members/get-datatable-data"
                onRowClick={console.log}
            />

            <Formik<{
                user_uuid: string | null
            }>
                initialValues={{
                    user_uuid: null,
                }}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post('/clm/members', values)
                        .then(() => {
                            handleClose()
                        })
                        .catch(error => handle422(error, setErrors))
                }
                component={({
                    submitForm,
                    isSubmitting,
                }: FormikProps<{
                    user_uuid: string | null
                }>) => {
                    return (
                        <Dialog open={open} maxWidth="xs" fullWidth>
                            <DialogTitle>Daftarkan Anggota</DialogTitle>

                            <DialogContent>
                                <UserSelect
                                    disabled={false}
                                    name="user_uuid"
                                    label="Pilih Pengguna"
                                />
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    color="inherit"
                                    disabled={isSubmitting}
                                    size="small"
                                    onClick={handleClose}>
                                    Batal
                                </Button>
                                <Button
                                    color="success"
                                    disabled={isSubmitting}
                                    size="small"
                                    type="submit"
                                    onClick={submitForm}>
                                    Daftarkan
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )
                }}
                onReset={handleClose}
            />

            <Fab onClick={() => setOpen(true)} disabled={open} />
        </>
    )
}

const columns: DataTableV2Props['columns'] = [
    {
        data: 'created_at',
        title: 'Dibuat Pada',
        visible: false,
    },
    {
        data: 'user.id',
        title: 'ID',
        orderable: false,
    },
    {
        data: 'user.name',
        title: 'Nama',
        orderable: false,
    },
    {
        data: 'user.lands',
        title: 'Lahan',
        orderable: false,
        render: (lands: Member['user']['lands']) => (
            <ul>
                {lands?.map(land => (
                    <li key={land.uuid}>
                        <TextShortener text={land.uuid} /> (
                        {land.n_area_hectares} Ha)
                    </li>
                ))}
            </ul>
        ),
    },
    // {
    //     data: 'status',
    //     title: 'Status',
    //     searchable: false,
    //     orderable: false,
    // },
    {
        data: null,
        name: 'actions',
        title: 'Aksi',
        orderable: false,
        searchable: false,
        render: (data: Member) => (
            <Button
                variant="outlined"
                size="small"
                href={'/clm/members/' + data.user_uuid}>
                Detail
            </Button>
        ),
    },
]
