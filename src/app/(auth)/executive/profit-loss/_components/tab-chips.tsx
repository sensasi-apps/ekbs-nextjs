// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import dayjs from 'dayjs'
// materials
import Chip from '@mui/material/Chip'
// icons-materials
import Refresh from '@mui/icons-material/Refresh'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
import ScrollableXBox from '@/components/ScrollableXBox'
// enums
import BusinessUnit from '@/enums/business-unit'

export function TabChips({
    disabled,
    onRefreshClick,
    activeTab,
    year,
}: {
    disabled: boolean
    onRefreshClick: () => void
    activeTab: string
    year: string
}) {
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams],
    )

    function handleActiveTabChange(value: string) {
        replace('?' + createQueryString('activeTab', value))
    }

    function handleYearChange(value: string) {
        replace('?' + createQueryString('year', value))
    }

    return (
        <ScrollableXBox>
            <Chip
                label="Umum"
                disabled={disabled}
                onClick={() => handleActiveTabChange('umum')}
                color={activeTab === 'umum' ? 'success' : undefined}
            />

            <Chip
                label="Alat Berat"
                disabled={disabled}
                onClick={() => handleActiveTabChange('alat-berat')}
                color={activeTab === 'alat-berat' ? 'success' : undefined}
            />

            <Chip
                label="Minimarket"
                disabled={disabled}
                onClick={() =>
                    handleActiveTabChange(BusinessUnit.BELAYAN_MART.toString())
                }
                color={
                    activeTab === BusinessUnit.BELAYAN_MART.toString()
                        ? 'success'
                        : undefined
                }
            />

            <Chip
                label="SAPRODI"
                disabled={disabled}
                onClick={() => handleActiveTabChange('saprodi')}
                color={activeTab === 'saprodi' ? 'success' : undefined}
            />

            <Chip
                label="SPP"
                disabled={disabled}
                onClick={() => handleActiveTabChange('spp')}
                color={activeTab === 'spp' ? 'success' : undefined}
            />

            <Chip
                label="TBS"
                disabled={disabled}
                onClick={() => handleActiveTabChange('tbs')}
                color={activeTab === 'tbs' ? 'success' : undefined}
            />

            <Chip
                label="BENGKEL"
                disabled={disabled}
                onClick={() =>
                    handleActiveTabChange(BusinessUnit.BENGKEL.toString())
                }
                color={
                    activeTab === BusinessUnit.BENGKEL.toString()
                        ? 'success'
                        : undefined
                }
            />

            <Chip
                label="SPK"
                disabled={disabled}
                onClick={() =>
                    handleActiveTabChange(
                        BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString(),
                    )
                }
                color={
                    activeTab ===
                    BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString()
                        ? 'success'
                        : undefined
                }
            />

            <Chip
                label="COFFEESHOP"
                disabled={disabled}
                onClick={() =>
                    handleActiveTabChange(
                        BusinessUnit.COFFEESHOP_DEPAN_KANTOR.toString(),
                    )
                }
                color={
                    activeTab ===
                    BusinessUnit.COFFEESHOP_DEPAN_KANTOR.toString()
                        ? 'success'
                        : undefined
                }
            />

            <DatePicker
                disabled={disabled}
                slotProps={{
                    textField: {
                        fullWidth: false,
                    },
                }}
                sx={{
                    minWidth: '8rem',
                    maxWidth: '8rem',
                    ml: 2,
                }}
                label="Tahun"
                value={dayjs(`${year}-01-01`)}
                format="YYYY"
                onChange={date => handleYearChange(date?.format('YYYY') ?? '')}
                minDate={dayjs('2024')}
                maxDate={dayjs()}
                views={['year']}
            />

            <IconButton
                disabled={disabled}
                onClick={onRefreshClick}
                title="Segarkan"
                icon={Refresh}
            />
        </ScrollableXBox>
    )
}
