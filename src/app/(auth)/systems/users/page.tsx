'use client'

// icons
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
// parts
import { UserSummaryBox } from '@/app/(auth)/systems/users/[uuid]/_parts/summary-box'
import Datatable, { type DatatableProps } from '@/components/Datatable'
// components
import Fab from '@/components/Fab'
import UserRoleChips from '@/components/User/RoleChips'
import UserFormDialog from '@/modules/user/components/user-form-dialog'
import useFormData, { FormDataProvider } from '@/providers/FormData'

export default function Page() {
    const { push } = useRouter()

    const searchParams = useSearchParams()
    const selectedRole = searchParams?.get('role') ?? ''

    return (
        <>
            <Grid
                container
                spacing={3}
                sx={{
                    flexDirection: {
                        md: 'row',
                        xs: 'column-reverse',
                    },
                }}>
                <Grid size={{ md: 8, xs: 12 }}>
                    <FormDataProvider>
                        <UserFormDialogWithFab />
                    </FormDataProvider>

                    <Datatable
                        apiUrl="users/get-datatable-data"
                        apiUrlParams={{
                            role: selectedRole,
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={DEFAULT_SORT_ORDER}
                        onRowClick={(data, _, { detail }) => {
                            if (detail === 2) {
                                /**
                                 * data[1] is the UUID. declared on {@link DATATABLE_COLUMNS}
                                 */
                                const uuid = data[1]

                                push(`/systems/users/${uuid}?role=selectedRole`)
                            }
                        }}
                        tableId="users-table"
                        title="Daftar Pengguna"
                        viewColumns={false}
                    />
                </Grid>

                <Grid size={{ md: 4, xs: 12 }}>
                    <UserSummaryBox />
                </Grid>
            </Grid>
        </>
    )
}

function UserFormDialogWithFab() {
    const { handleCreate, isDataNotUndefined } = useFormData()

    return (
        <>
            <UserFormDialog />

            <Fab
                color="success"
                in={!isDataNotUndefined}
                onClick={() => {
                    handleCreate()
                }}
                title="Buat pengguna baru">
                <PersonAddIcon />
            </Fab>
        </>
    )
}

const DEFAULT_SORT_ORDER: DatatableProps['defaultSortOrder'] = {
    direction: 'asc',
    name: 'name',
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        name: 'uuid',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Nama',
        name: 'name',
    },
    {
        name: 'nickname',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Peran',
        name: 'role_names_id',
        options: {
            customBodyRender: (roleNames: string[]) => (
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                    <UserRoleChips data={roleNames} size="small" />
                </Box>
            ),
            searchable: false,
            setCellProps: () => ({
                style: {
                    maxWidth: '150px',
                },
            }),
            sort: false,
        },
    },
]
