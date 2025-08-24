'use client'

// vendors
import { Formik, type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import myAxios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
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
import FlexBox from '@/components/flex-box'
import ListInsideMuiDatatableCell from '@/components/ListInsideMuiDatatableCell'
import PageTitle from '@/components/page-title'
import TextShortener from '@/components/text-shortener'
import UserSelect from '@/components/FormikForm/user-select'
// utils
import handle422 from '@/utils/handle-422'
import ClmMemberFilterChips from './_filter-chips'
// modules
import type Land from '@/modules/clm/types/orms/land'
import type MemberORM from '@/modules/clm/types/orms/member'
import CertificationCheckboxes from '@/modules/clm/components/certification-checkboxes'

export default function Members() {
    const searchParams = useSearchParams()
    const status = searchParams.get('status') ?? ''

    const { push } = useRouter()
    const [open, setOpen] = useState(false)
    const mutateRef = useRef<MutateType<MemberORM> | undefined>(undefined)
    const getRowDataRef = useRef<GetRowDataType<MemberORM> | undefined>(
        undefined,
    )

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            <PageTitle title="Anggota Sertifikasi" />

            <FlexBox mb={2} gap={1}>
                <ClmMemberFilterChips />
            </FlexBox>

            <Datatable<MemberORM>
                apiUrl="/clm/members/get-datatable-data"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'created_at', direction: 'desc' }}
                apiUrlParams={{
                    status,
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        // console.log(data)
                        const member = getRowDataRef.current?.(dataIndex)

                        if (member) {
                            push('/clm/members/' + member.user_uuid)
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

                                <Box mt={2}>
                                    <CertificationCheckboxes />
                                </Box>
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

const DATATABLE_COLUMNS: DatatableProps<MemberORM>['columns'] = [
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
            customBodyRender: (value: Land[]) => {
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
        name: 'created_at',
        options: {
            display: 'excluded',
        },
    },
]
