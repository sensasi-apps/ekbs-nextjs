'use client'

// icons
import Add from '@mui/icons-material/Add'
import Check from '@mui/icons-material/Check'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import Edit from '@mui/icons-material/Edit'
import ForestIcon from '@mui/icons-material/Forest'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// vendors
import { Formik, type FormikProps } from 'formik'
import { Fragment, useState } from 'react'
import useSWR from 'swr'
// components
import { AoaTable } from '@/components/aoa-table'
import Fab from '@/components/Fab'
import Radio from '@/components/formik-fields/radio'
import Switch from '@/components/formik-fields/switch'
import TextField from '@/components/formik-fields/text-field'
import IconButton from '@/components/IconButton'
import PageTitle from '@/components/page-title'
import myAxios from '@/lib/axios'
import CertificationCheckboxes from '@/modules/clm/components/certification-checkboxes'
//
import type Requisite from '@/modules/clm/types/orms/requisite'
import handle422 from '@/utils/handle-422'

type FormData = Omit<Requisite, 'id' | 'is_optional' | 'certifications'> & {
    id?: number
    is_required: boolean
    certifications: string[]
}

export default function Page() {
    const [formData, setFormData] = useState<FormData>()

    const {
        data = [],
        mutate,
        isLoading,
        isValidating,
    } = useSWR<
        (Requisite & {
            certifications: {
                id: number
                name: string
            }[]
        })[]
    >('clm/requisites')

    const showLinearProgress = isLoading || isValidating

    const aoaUserData = data
        .filter(({ type }) => type === 'user')
        .map(row => [
            ...dataToRow(row),
            <IconButton
                color="primary"
                icon={Edit}
                key={row.id}
                onClick={() => {
                    setFormData({
                        ...row,
                        certifications: row.certifications.map(
                            ({ id }) => `${id}`,
                        ),
                        is_required: !row.is_optional,
                    })
                }}
                title="Ubah"
            />,
        ])

    const aoaLandData = data
        .filter(({ type }) => type === 'land')
        .map(row => [
            ...dataToRow(row),
            <IconButton
                color="primary"
                icon={Edit}
                key={row.id}
                onClick={() => {
                    setFormData({
                        ...row,
                        certifications: row.certifications.map(
                            ({ id }) => `${id}`,
                        ),
                        is_required: !row.is_optional,
                    })
                }}
                title="Ubah"
            />,
        ])

    return (
        <>
            <PageTitle
                subtitle="Pengaturan syarat yang akan berlaku untuk semua anggota dan lahan"
                title="Syarat Sertifikasi"
            />

            <Grid container spacing={4}>
                <Grid
                    size={{
                        md: 6,
                        sm: 12,
                        xs: 12,
                    }}>
                    <Typography
                        component="div"
                        display="flex"
                        gap={1}
                        mb={1}
                        variant="h6">
                        <ContactPageIcon />
                        Perorangan
                    </Typography>
                    <LinearProgress
                        sx={{
                            visibility: showLinearProgress
                                ? 'visible'
                                : 'hidden',
                        }}
                    />

                    <AoaTable
                        dataRows={aoaUserData}
                        headers={['Wajib', 'Nama', 'Sertifikasi', 'Aksi']}
                    />
                </Grid>

                <Grid
                    size={{
                        md: 6,
                        sm: 12,
                        xs: 12,
                    }}>
                    <Typography
                        component="div"
                        display="flex"
                        gap={1}
                        mb={1}
                        variant="h6">
                        <ForestIcon />
                        Lahan
                    </Typography>

                    <LinearProgress
                        sx={{
                            visibility: showLinearProgress
                                ? 'visible'
                                : 'hidden',
                        }}
                    />

                    <AoaTable
                        dataRows={aoaLandData}
                        headers={['Wajib', 'Nama', 'Sertifikasi', 'Aksi']}
                    />
                </Grid>
            </Grid>

            <RequisiteForm
                formData={formData}
                onCancel={() => {
                    setFormData(undefined)
                }}
                onSubmitted={() => {
                    setFormData(undefined)
                    mutate()
                }}
            />

            <Fab
                onClick={() =>
                    setFormData({
                        certifications: [],
                        description: '',
                        is_required: false,
                        name: '',
                        type: 'user',
                    })
                }>
                <Add />
            </Fab>
        </>
    )
}

function RequisiteForm({
    formData,
    onSubmitted,
    onCancel,
}: {
    formData: FormData | undefined
    onSubmitted: () => void
    onCancel: () => void
}) {
    if (!formData) {
        return null
    }

    return (
        <Formik<FormData>
            component={({
                submitForm,
                isSubmitting,
            }: FormikProps<FormData>) => {
                return (
                    <Dialog fullWidth maxWidth="xs" open={Boolean(formData)}>
                        <DialogTitle>
                            {formData?.id ? 'Ubah' : 'Tambah'} Syarat
                        </DialogTitle>

                        {isSubmitting && <LinearProgress />}

                        <DialogContent>
                            <TextField label="Nama" name="name" />

                            <TextField
                                label="Keterangan"
                                name="description"
                                textFieldProps={{
                                    multiline: true,
                                    required: false,
                                    rows: 2,
                                }}
                            />

                            <Radio
                                label="Syarat Untuk"
                                name="type"
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

                            <CertificationCheckboxes />

                            <Switch
                                name="is_required"
                                switchLabel="Syarat Wajib"
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button
                                color="inherit"
                                disabled={isSubmitting}
                                onClick={onCancel}
                                size="small">
                                Batal
                            </Button>
                            <Button
                                color="success"
                                disabled={isSubmitting}
                                onClick={submitForm}
                                size="small"
                                type="submit">
                                Simpan
                            </Button>
                        </DialogActions>
                    </Dialog>
                )
            }}
            initialValues={formData}
            onReset={onCancel}
            onSubmit={(values, { setErrors }) =>
                myAxios
                    .post('/clm/requisites', values)
                    .then(onSubmitted)
                    .catch(error => handle422(error, setErrors))
            }
        />
    )
}

function dataToRow(data: Requisite) {
    return [
        data.is_optional ? '' : <Check color="success" key={data.id} />,
        <Fragment key={data.id}>
            {data.name}
            <Typography component="div" variant="caption">
                {data.description}
            </Typography>
        </Fragment>,
        data.certifications?.map(({ name }) => name).join(', '),
    ]
}
