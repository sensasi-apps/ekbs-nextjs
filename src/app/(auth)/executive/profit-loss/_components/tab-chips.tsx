// vendors

// icons-materials
import Refresh from '@mui/icons-material/Refresh'
// materials
import Chip from '@mui/material/Chip'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
// components
import DatePicker from '@/components/date-picker'
import IconButton from '@/components/icon-button'
import ScrollableXBox from '@/components/scrollable-x-box'
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
        replace(`?${createQueryString('activeTab', value)}`)
    }

    function handleYearChange(value: string) {
        replace(`?${createQueryString('year', value)}`)
    }

    return (
        <ScrollableXBox>
            <Chip
                color={activeTab === 'umum' ? 'success' : undefined}
                disabled={disabled}
                label="Umum"
                onClick={() => handleActiveTabChange('umum')}
            />

            <Chip
                color={activeTab === 'alat-berat' ? 'success' : undefined}
                disabled={disabled}
                label="Alat Berat"
                onClick={() => handleActiveTabChange('alat-berat')}
            />

            <Chip
                color={
                    activeTab === BusinessUnit.BELAYAN_MART.toString()
                        ? 'success'
                        : undefined
                }
                disabled={disabled}
                label="Minimarket"
                onClick={() =>
                    handleActiveTabChange(BusinessUnit.BELAYAN_MART.toString())
                }
            />

            <Chip
                color={activeTab === 'saprodi' ? 'success' : undefined}
                disabled={disabled}
                label="SAPRODI"
                onClick={() => handleActiveTabChange('saprodi')}
            />

            <Chip
                color={activeTab === 'spp' ? 'success' : undefined}
                disabled={disabled}
                label="SPP"
                onClick={() => handleActiveTabChange('spp')}
            />

            <Chip
                color={activeTab === 'tbs' ? 'success' : undefined}
                disabled={disabled}
                label="TBS"
                onClick={() => handleActiveTabChange('tbs')}
            />

            <Chip
                color={
                    activeTab === BusinessUnit.BENGKEL.toString()
                        ? 'success'
                        : undefined
                }
                disabled={disabled}
                label="BENGKEL"
                onClick={() =>
                    handleActiveTabChange(BusinessUnit.BENGKEL.toString())
                }
            />

            <Chip
                color={
                    activeTab ===
                    BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString()
                        ? 'success'
                        : undefined
                }
                disabled={disabled}
                label="SPK"
                onClick={() =>
                    handleActiveTabChange(
                        BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN.toString(),
                    )
                }
            />

            <Chip
                color={
                    activeTab ===
                    BusinessUnit.COFFEESHOP_DEPAN_KANTOR.toString()
                        ? 'success'
                        : undefined
                }
                disabled={disabled}
                label="COFFEESHOP"
                onClick={() =>
                    handleActiveTabChange(
                        BusinessUnit.COFFEESHOP_DEPAN_KANTOR.toString(),
                    )
                }
            />

            <DatePicker
                disabled={disabled}
                format="YYYY"
                label="Tahun"
                maxDate={dayjs()}
                minDate={dayjs('2024')}
                onChange={date => handleYearChange(date?.format('YYYY') ?? '')}
                slotProps={{
                    textField: {
                        fullWidth: false,
                    },
                }}
                sx={{
                    maxWidth: '8rem',
                    minWidth: '8rem',
                    ml: 2,
                }}
                value={dayjs(`${year}-01-01`)}
                views={['year']}
            />

            <IconButton
                disabled={disabled}
                icon={Refresh}
                onClick={onRefreshClick}
                title="Segarkan"
            />
        </ScrollableXBox>
    )
}
