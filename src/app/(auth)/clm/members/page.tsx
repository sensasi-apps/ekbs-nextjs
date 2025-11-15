'use client'

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// vendors
import { Formik, type FormikProps } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
// components
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/data-table'
import UlInsideMuiDatatableCell from '@/components/datatable.ul-inside-cell'
import Fab from '@/components/fab'
import FlexBox from '@/components/flex-box'
import UserSelect from '@/components/formik-fields/user-select'
import PageTitle from '@/components/page-title'
import TextShortener from '@/components/text-shortener'
import myAxios from '@/lib/axios'
import CertificationCheckboxes from '@/modules/clm/components/certification-checkboxes'
// modules
import type Land from '@/modules/clm/types/orms/land'
import type MemberORM from '@/modules/clm/types/orms/member'
// utils
import handle422 from '@/utils/handle-422'
import ClmMemberFilterChips from './_filter-chips'

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

            <FlexBox gap={1} mb={2}>
                <ClmMemberFilterChips />
            </FlexBox>

            <Datatable<MemberORM>
                apiUrl="/clm/members/get-datatable-data"
                apiUrlParams={{
                    status,
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'created_at' }}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                mutateCallback={fn => (mutateRef.current = fn)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        // console.log(data)
                        const member = getRowDataRef.current?.(dataIndex)

                        if (member) {
                            push(`/clm/members/${member.user_uuid}`)
                        }
                    }
                }}
                tableId="clm-members-datatable"
                title="Daftar Anggota"
            />

            <Formik<{
                user_uuid: string | null
            }>
                component={({
                    submitForm,
                    isSubmitting,
                }: FormikProps<{
                    user_uuid: string | null
                }>) => {
                    return (
                        <Dialog fullWidth maxWidth="xs" open={open}>
                            <DialogTitle>Daftarkan Anggota</DialogTitle>

                            <DialogContent>
                                <UserSelect
                                    disabled={false}
                                    label="Pilih Pengguna"
                                    name="user_uuid"
                                />

                                <Box mt={2}>
                                    <CertificationCheckboxes />
                                </Box>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    color="inherit"
                                    disabled={isSubmitting}
                                    onClick={handleClose}
                                    size="small">
                                    Batal
                                </Button>
                                <Button
                                    color="success"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                    size="small"
                                    type="submit">
                                    Daftarkan
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )
                }}
                initialValues={{
                    user_uuid: null,
                }}
                onReset={handleClose}
                onSubmit={(values, { setErrors }) =>
                    myAxios
                        .post('/clm/members', values)
                        .then(() => {
                            mutateRef.current?.()
                            handleClose()
                        })
                        .catch(error => handle422(error, setErrors))
                }
            />

            <Fab disabled={open} onClick={() => setOpen(true)} />
        </>
    )
}

const DATATABLE_COLUMNS: DataTableProps<MemberORM>['columns'] = [
    {
        label: 'ID',
        name: 'user.id',
    },
    {
        label: 'Nama',
        name: 'user.name',
    },

    {
        label: 'Lahan',
        name: 'user.lands',
        options: {
            customBodyRender: (lands: Land[]) => (
                <UlInsideMuiDatatableCell>
                    {lands.map(land => (
                        <Box component="li" key={land.uuid}>
                            <TextShortener text={land.uuid} /> (
                            {land.n_area_hectares} Ha)
                        </Box>
                    ))}
                </UlInsideMuiDatatableCell>
            ),
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
