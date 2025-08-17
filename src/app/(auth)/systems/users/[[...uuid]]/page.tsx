'use client'

// vendors
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
// components
import { FormDataProvider } from '@/providers/FormData'
import Datatable, { type DatatableProps } from '@/components/Datatable'
import UserRoleChips from '@/components/User/RoleChips'
// parts
import { UserSummaryBox } from '@/app/(auth)/systems/users/[[...uuid]]/_parts/summary-box'
import { UserWithDetailsProvider } from '@/app/(auth)/systems/users/[[...uuid]]/_parts/user-with-details-provider'
import UserDialogFormWithFab from '@/app/(auth)/systems/users/[[...uuid]]/_parts/dialog-form-with-fab'
import UsersMainPageContent from '@/app/(auth)/systems/users/[[...uuid]]/_parts/main-page-content'

export default function Page() {
    const { push } = useRouter()
    const params = useParams()

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
                    <UserWithDetailsProvider>
                        <FormDataProvider>
                            <Collapse in={Boolean(params?.uuid)} unmountOnExit>
                                <UsersMainPageContent />
                            </Collapse>

                            <UserDialogFormWithFab />
                        </FormDataProvider>
                    </UserWithDetailsProvider>

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
                                push(
                                    '/systems/users/' +
                                        /**
                                         * data[1] is the UUID. declared on `DATATABLE_COLUMNS`
                                         */
                                        data[1] +
                                        '?role=' +
                                        selectedRole,
                                )
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
