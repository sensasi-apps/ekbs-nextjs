// vendors
import { Formik, type FormikProps } from 'formik'
import { useRef, useState } from 'react'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid2'
import LinearProgress from '@mui/material/LinearProgress'
// icons
import Add from '@mui/icons-material/Add'
import Check from '@mui/icons-material/Check'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import myAxios from '@/lib/axios'
import handle422 from '@/utils/errorCatcher'
import { Radio, TextField } from '@/components/FormikForm'
import Switch from '@/components/FormikForm/switch'

interface Requisite {
    id: number
    name: string
    description: string | null
    type: 'user' | 'land'
    is_optional: boolean
}

type FormData = Omit<Requisite, 'id' | 'is_optional'> & {
    id?: number
    is_required: boolean
}

export default function Page() {
    const [formData, setFormData] = useState<FormData>()
    const USER_mutateRef = useRef<MutateType<Requisite>>()
    const USER_getRowDataRef = useRef<GetRowDataType<Requisite>>()

    const LAND_mutateRef = useRef<MutateType<Requisite>>()
    const LAND_getRowDataRef = useRef<GetRowDataType<Requisite>>()

    return (
        <AuthLayout
            title="Syarat Sertifikasi"
            subtitle="Pengaturan syarat yang akan berlaku untuk semua anggota dan lahan">
            <Grid container spacing={2} mt={2}>
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                    }}>
                    <Datatable<Requisite>
                        tableId="clm-user-requisites-datatable"
                        title="Syarat Perorangan"
                        apiUrl="/clm/requisites/get-datatable-data"
                        apiUrlParams={{
                            type: 'user',
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{ name: 'name', direction: 'asc' }}
                        onRowClick={(_, { dataIndex }, event) => {
                            if (event.detail === 2) {
                                const data =
                                    USER_getRowDataRef.current?.(dataIndex)

                                if (data) {
                                    setFormData({
                                        ...data,
                                        is_required: !data?.is_optional,
                                    })
                                }
                            }
                        }}
                        mutateCallback={fn => (USER_mutateRef.current = fn)}
                        getRowDataCallback={fn =>
                            (USER_getRowDataRef.current = fn)
                        }
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                    }}>
                    <Datatable
                        tableId="clm-user-requisites-datatable"
                        title="Syarat per Lahan"
                        apiUrl="/clm/requisites/get-datatable-data"
                        apiUrlParams={{
                            type: 'land',
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{ name: 'name', direction: 'asc' }}
                        onRowClick={(_, { dataIndex }, event) => {
                            if (event.detail === 2) {
                                const data =
                                    LAND_getRowDataRef.current?.(dataIndex)

                                if (data) {
                                    setFormData({
                                        ...data,
                                        is_required: !data?.is_optional,
                                    })
                                }
                            }
                        }}
                        mutateCallback={fn => (LAND_mutateRef.current = fn)}
                        getRowDataCallback={fn =>
                            (LAND_getRowDataRef.current = fn)
                        }
                    />
                </Grid>
            </Grid>

            <RequisiteForm
                formData={formData}
                onCancel={() => {
                    setFormData(undefined)
                }}
                onCLose={() => {
                    setFormData(undefined)
                    USER_mutateRef.current?.()
                    LAND_mutateRef.current?.()
                }}
            />

            <Fab
                onClick={() =>
                    setFormData({
                        name: '',
                        description: '',
                        is_required: false,
                        type: 'user',
                    })
                }>
                <Add />
            </Fab>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Requisite>['columns'] = [
    // {
    //     name: 'id',
    //     label: 'ID',
    // },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'description',
        label: 'Keterangan',
        options: {
            sort: false,
        },
    },
    {
        name: 'is_optional',
        label: 'Wajib',
        options: {
            searchable: false,
            customBodyRender: (value: boolean) => {
                return value ? '' : <Check color="success" />
            },
        },
    },

    // {
    //     name: 'status',
    //     label: 'Status',
    //     options: {
    //         searchable: false,
    //         sort: false,
    //     },
    // },

    // {
    //     name: 'created_at',
    //     options: {
    //         display: 'excluded',
    //     },
    // },
]

function RequisiteForm({
    formData,
    onCLose,
    onCancel,
}: {
    formData: FormData | undefined
    onCLose: () => void
    onCancel: () => void
}) {
    if (!formData) {
        return null
    }

    return (
        <Formik<FormData>
            initialValues={formData}
            onSubmit={(values, { setErrors }) =>
                myAxios
                    .post('/clm/requisites', values)
                    .then(onCLose)
                    .catch(error => handle422(error, setErrors))
            }
            component={({
                submitForm,
                isSubmitting,
            }: FormikProps<FormData>) => {
                return (
                    <Dialog open={Boolean(formData)} maxWidth="xs" fullWidth>
                        <DialogTitle>
                            {formData?.id ? 'Ubah' : 'Tambah'} Syarat
                        </DialogTitle>

                        {isSubmitting && <LinearProgress />}

                        <DialogContent>
                            <TextField name="name" label="Nama" />

                            <TextField
                                name="description"
                                label="Keterangan"
                                textFieldProps={{
                                    multiline: true,
                                    required: false,
                                    rows: 2,
                                }}
                            />

                            <Radio
                                name="type"
                                label="Syarat Untuk"
                                options={[
                                    {
                                        label: 'Perorangan',
                                        value: 'user',
                                    },
                                    {
                                        label: 'Lahan',
                                        value: 'land',
                                    },
                                ]}
                            />

                            <Switch
                                name="is_required"
                                switchLabel="Syarat Wajib"
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button
                                color="inherit"
                                disabled={isSubmitting}
                                size="small"
                                onClick={onCancel}>
                                Batal
                            </Button>
                            <Button
                                color="success"
                                disabled={isSubmitting}
                                size="small"
                                type="submit"
                                onClick={submitForm}>
                                Simpan
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
            }}
            onReset={onCancel}
        />
    )
}
