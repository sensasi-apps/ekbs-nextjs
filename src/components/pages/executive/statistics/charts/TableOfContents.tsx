// vendors
import { ReactNode, memo } from 'react'
// materials
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const TableOfContents = memo(function TableOfContents() {
    const lis: (ListItem | string)[] = [
        {
            label: 'Anggota',
            lis: ['Total Anggota', 'Total Partisipasi'],
        },
        {
            label: 'Keuangan',
            lis: [
                {
                    id: 'alokasi-distribusi-saldo',
                    label: 'Alokasi/Distribusi Saldo',
                },
                'Saldo Masuk-Keluar',
            ],
        },
        'Piutang',
        {
            label: 'Unit Bisnis',
            lis: [
                {
                    label: 'Alat Berat',
                    lis: [
                        'HM Unit',
                        'Total HM Kerja',
                        'Omzet',
                        'Pembelian BBM',
                    ],
                },
                {
                    label: 'SAPRODI',
                    lis: ['Pembelian-Penjualan'],
                },
                {
                    label: 'SPP',
                    lis: ['Pencairan-Pengembalian'],
                },
                {
                    label: 'TBS',
                    lis: ['Bobot', 'Penjualan-Pencairan'],
                },
            ],
        },
    ]

    return <Ul disablePadding>{renderLis(lis)}</Ul>
})

export default TableOfContents

const Ul = ({
    children,
    disablePadding,
}: {
    children: ReactNode
    disablePadding?: boolean
}) => (
    <Typography
        variant="caption"
        component="ul"
        sx={{
            m: 0,
            pl: disablePadding ? 0 : 2,
            listStyleType: 'none',

            '& > li > a': {
                color: 'inherit',
            },
            '& > li::before': {
                content: '"# "',
                color: 'success.main',
            },
        }}>
        {children}
    </Typography>
)

function renderLis(liItems: (ListItem | string)[]) {
    return liItems.map(item => {
        let id, label, lis

        if (typeof item === 'string') {
            label = item
        } else {
            id = item.id
            label = item.label
            lis = item.lis
        }

        return (
            <li key={id ?? label.toLowerCase()}>
                <Link
                    href={`#${id ?? label.toLowerCase().replaceAll(' ', '-')}`}>
                    {label}
                </Link>

                {lis && <Ul>{renderLis(lis)}</Ul>}
            </li>
        )
    })
}

type ListItem = {
    id?: string
    label: string
    lis?: (ListItem | string)[]
}
