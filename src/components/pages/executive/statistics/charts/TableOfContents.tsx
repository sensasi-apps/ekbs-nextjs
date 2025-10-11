// vendors

// materials
import Typography from '@mui/material/Typography'
import { memo, type ReactNode } from 'react'
// components
import Link from '@/components/link'

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
                    lis: ['Penjualan-Pembelian', 'Barang Keluar-Masuk'],
                },
                {
                    label: 'SPP',
                    lis: ['Pencairan-Pengembalian'],
                },
                {
                    label: 'TBS',
                    lis: [
                        'Bobot',
                        'Penjualan-Pelunasan',
                        'Kontribusi Kelompok Tani',
                    ],
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
        component="ul"
        sx={{
            '& > li > a': {
                color: 'inherit',
            },
            '& > li::before': {
                color: 'success.main',
                content: '"# "',
            },
            listStyleType: 'none',
            m: 0,
            pl: disablePadding ? 0 : 2,
        }}
        variant="caption">
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
