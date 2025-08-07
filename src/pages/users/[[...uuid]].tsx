// vendors
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
// components
import { FormDataProvider } from '@/providers/FormData'
import { UserWithDetailsProvider } from '@/providers/UserWithDetails'
import Datatable, { type DatatableProps } from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import UserRoleChips from '@/components/User/RoleChips'
import UsersMainPageContent from '@/components/Users/MainPageContent'
import UsersSummaryBox from '@/components/Users/SummaryBox'
import UserDialogFormWithFab from '@/components/User/DialogFormWithFab'

export default function Page() {
    const { push, query } = useRouter()

    return (
        <AuthLayout title="Pengguna">
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
                            <Collapse in={Boolean(query.uuid)} unmountOnExit>
                                <UsersMainPageContent />
                            </Collapse>

                            <UserDialogFormWithFab />
                        </FormDataProvider>
                    </UserWithDetailsProvider>

                    <Datatable
                        apiUrl="users/get-datatable-data"
                        apiUrlParams={{
                            role: query.role as string,
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={DEFAULT_SORT_ORDER}
                        viewColumns={false}
                        onRowClick={(data, _, { detail }) =>
                            detail === 2 &&
                            push({
                                pathname: `/users/${data[1]}`,
                                query: {
                                    role: query.role,
                                },
                            })
                        }
                        tableId="users-table"
                        title="Daftar Pengguna"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <UsersSummaryBox />
                </Grid>
            </Grid>
        </AuthLayout>
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
