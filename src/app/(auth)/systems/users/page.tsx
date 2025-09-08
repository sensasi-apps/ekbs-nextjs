'use client'

// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// components
import Fab from '@/components/Fab'
import useFormData, { FormDataProvider } from '@/providers/FormData'
import Datatable, { type DatatableProps } from '@/components/Datatable'
import UserRoleChips from '@/components/User/RoleChips'
// parts
import { UserSummaryBox } from '@/app/(auth)/systems/users/[uuid]/_parts/summary-box'
import UserFormDialog from '@/modules/user/components/user-form-dialog'
// icons
import PersonAddIcon from '@mui/icons-material/PersonAdd'

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
                        xs: 'column-reverse',
                        md: 'row',
                    },
                }}>
                <Grid size={{ xs: 12, md: 8 }}>
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
                        viewColumns={false}
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
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
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
                title="Buat pengguna baru"
                in={!isDataNotUndefined}
                onClick={() => {
                    handleCreate()
                }}
                color="success">
                <PersonAddIcon />
            </Fab>
        </>
    )
}

const DEFAULT_SORT_ORDER: DatatableProps['defaultSortOrder'] = {
    name: 'name',
    direction: 'asc',
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'uuid',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'nickname',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        name: 'role_names_id',
        label: 'Peran',
        options: {
            searchable: false,
            sort: false,
            setCellProps: () => ({
                style: {
                    maxWidth: '150px',
                },
            }),
            customBodyRender: (roleNames: string[]) => (
                <Box display="flex" gap={0.5} flexWrap="wrap">
                    <UserRoleChips data={roleNames} size="small" />
                </Box>
            ),
        },
    },
]
