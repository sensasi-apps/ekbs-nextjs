'use client'

// vendors
import { Formik, type FormikProps } from 'formik'
import { useState } from 'react'
import useSWR from 'swr'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons
import Add from '@mui/icons-material/Add'
import Check from '@mui/icons-material/Check'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import Edit from '@mui/icons-material/Edit'
import ForestIcon from '@mui/icons-material/Forest'
// components
import { AoaTable } from '@/components/aoa-table'
import { Radio, TextField } from '@/components/FormikForm'
import Fab from '@/components/Fab'
import IconButton from '@/components/IconButton'
import PageTitle from '@/components/page-title'
import Switch from '@/components/FormikForm/switch'
//
import type Requisite from '@/modules/clm/types/orms/requisite'
import myAxios from '@/lib/axios'
import handle422 from '@/utils/handle-422'
import CertificationCheckboxes from '@/modules/clm/components/certification-checkboxes'

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
                title="Ubah"
                key={row.id}
                icon={Edit}
                color="primary"
                onClick={() => {
                    setFormData({
                        ...row,
                        is_required: !row.is_optional,
                        certifications: row.certifications.map(
                            ({ id }) => `${id}`,
                        ),
                    })
                }}
            />,
        ])

    const aoaLandData = data
        .filter(({ type }) => type === 'land')
        .map(row => [
            ...dataToRow(row),
            <IconButton
                title="Ubah"
                key={row.id}
                icon={Edit}
                color="primary"
                onClick={() => {
                    setFormData({
                        ...row,
                        is_required: !row.is_optional,
                        certifications: row.certifications.map(
                            ({ id }) => `${id}`,
                        ),
                    })
                }}
            />,
        ])

    return (
        <>
            <PageTitle
                title="Syarat Sertifikasi"
                subtitle="Pengaturan syarat yang akan berlaku untuk semua anggota dan lahan"
            />

            <Grid container spacing={4}>
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                    }}>
                    <Typography
                        variant="h6"
                        component="div"
                        display="flex"
                        gap={1}
                        mb={1}>
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
                        headers={['Wajib', 'Nama', 'Sertifikasi', 'Aksi']}
                        dataRows={aoaUserData}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                    }}>
                    <Typography
                        variant="h6"
                        component="div"
                        display="flex"
                        gap={1}
                        mb={1}>
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
                        headers={['Wajib', 'Nama', 'Sertifikasi', 'Aksi']}
                        dataRows={aoaLandData}
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
                        name: '',
                        description: '',
                        is_required: false,
                        type: 'user',
                        certifications: [],
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
            initialValues={formData}
            onSubmit={(values, { setErrors }) =>
                myAxios
                    .post('/clm/requisites', values)
                    .then(onSubmitted)
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

function dataToRow(data: Requisite) {
    return [
        data.is_optional ? '' : <Check color="success" />,
        <>
            {data.name}
            <Typography variant="caption" component="div">
                {data.description}
            </Typography>
        </>,
        data.certifications?.map(({ name }) => name).join(', '),
    ]
}
