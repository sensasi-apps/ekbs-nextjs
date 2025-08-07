// vendors
import { Formik, type FormikProps } from 'formik'
import { useRef, useState } from 'react'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'
import UserSelect from '@/components/FormikForm/user-select'
import myAxios from '@/lib/axios'
import handle422 from '@/utils/errorCatcher'
import type User from '@/features/user/types/user'
import { useRouter } from 'next/router'
import ListInsideMuiDatatableCell from '@/components/ListInsideMuiDatatableCell'
import TextShortener from '@/components/text-shortener'

interface Member {
    user_uuid: string
    user: User
}

export default function Members() {
    const { replace } = useRouter()
    const [open, setOpen] = useState(false)
    const mutateRef = useRef<MutateType<Member> | undefined>(undefined)
    const getRowDataRef = useRef<GetRowDataType<Member> | undefined>(undefined)

    function handleClose() {
        setOpen(false)
    }

    return (
        <AuthLayout title="Anggota Sertifikasi">
            <Datatable<Member>
                apiUrl="/clm/members/get-datatable-data"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'created_at', direction: 'desc' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        // console.log(data)
                        const member = getRowDataRef.current?.(dataIndex)

                        if (member) {
                            replace('/clm/members/' + member.user_uuid)
                        }
                    }
                }}
                mutateCallback={fn => (mutateRef.current = fn)}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                tableId="clm-members-datatable"
                title="Daftar Anggota"
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
                            mutateRef.current?.()
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
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Member>['columns'] = [
    {
        name: 'user.id',
        label: 'ID',
    },
    {
        name: 'user.name',
        label: 'Nama',
    },

    {
        name: 'user.lands',
        label: 'Lahan',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: Member['user']['lands']) => {
                return (
                    <ListInsideMuiDatatableCell
                        listItems={value ?? []}
                        renderItem={land => (
                            <>
                                <TextShortener text={land.uuid} /> (
                                {land.n_area_hectares} Ha)
                            </>
                        )}
                    />
                )
            },
        },
    },

    {
        name: 'status',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
        },
    },

    {
        name: 'created_at',
        options: {
            display: 'excluded',
        },
    },
]
