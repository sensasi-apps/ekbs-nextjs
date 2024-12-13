// types
import type { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'
// vendors
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import Grid2 from '@mui/material/Unstable_Grid2'
// components
import { UserWithDetailsProvider } from '@/providers/UserWithDetails'
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import UserRoleChips from '@/components/User/RoleChips'
import UsersMainPageContent from '@/components/Users/MainPageContent'
import UsersSummaryBox from '@/components/Users/SummaryBox'

export default function Page() {
    const { push, query } = useRouter()

    return (
        <AuthLayout title="Pengguna">
            <Grid2
                container
                spacing={3}
                sx={{
                    flexDirection: {
                        xs: 'column-reverse',
                        md: 'row',
                    },
                }}>
                <Grid2 xs={12} md={8}>
                    <UserWithDetailsProvider>
                        <UsersMainPageContent />
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
                            detail === 2 && push(`/users/${data[1]}`)
                        }
                        tableId="users-table"
                        title="Daftar Pengguna"
                    />
                </Grid2>

                <Grid2 xs={12} md={4}>
                    <UsersSummaryBox />
                </Grid2>
            </Grid2>
        </AuthLayout>
    )
}

const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'name',
    direction: 'asc',
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
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
