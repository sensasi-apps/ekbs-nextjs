// vendors
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
// materials
import Chip from '@mui/material/Chip'
// icons-materials
import Refresh from '@mui/icons-material/Refresh'
// components
import IconButton from '@/components/IconButton'
import ScrollableXBox from '@/components/ScrollableXBox'
// enums
import BusinessUnit from '@/enums/BusinessUnit'
import dynamic from 'next/dynamic'
import type { DatePickerProps } from '@/components/DatePicker'

const DatePicker = dynamic(() => import('@/components/DatePicker'), {
    ssr: false,
})

export function TabChips({
    disabled,
    onRefreshClick,
    onYearChange,
}: {
    disabled: boolean
    onRefreshClick: () => void
    onYearChange: DatePickerProps['onChange']
}) {
    const { replace, query } = useRouter()

    function handleActiveTabChange(value?: string) {
        replace({
            query: {
                ...query,
                activeTab: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <Chip
                label="Umum"
                disabled={disabled}
                onClick={() => handleActiveTabChange('umum')}
                color={
                    !query.activeTab || query.activeTab === 'umum'
                        ? 'success'
                        : undefined
                }
            />

            <Chip
                label="Alat Berat"
                disabled={disabled}
                onClick={() => handleActiveTabChange('alat-berat')}
                color={query.activeTab === 'alat-berat' ? 'success' : undefined}
            />

            <Chip
                label="Minimarket"
                disabled={disabled}
                onClick={() =>
                    handleActiveTabChange(BusinessUnit.BELAYAN_MART.toString())
                }
                color={
                    query.activeTab === BusinessUnit.BELAYAN_MART.toString()
                        ? 'success'
                        : undefined
                }
            />

            <Chip
                label="SAPRODI"
                disabled={disabled}
                onClick={() => handleActiveTabChange('saprodi')}
                color={query.activeTab === 'saprodi' ? 'success' : undefined}
            />

            <Chip
                label="SPP"
                disabled={disabled}
                onClick={() => handleActiveTabChange('spp')}
                color={query.activeTab === 'spp' ? 'success' : undefined}
            />

            <Chip
                label="TBS"
                disabled={disabled}
                onClick={() => handleActiveTabChange('tbs')}
                color={query.activeTab === 'tbs' ? 'success' : undefined}
            />

            <Chip
                label="BENGKEL"
                disabled={disabled}
                onClick={() =>
                    handleActiveTabChange(BusinessUnit.BENGKEL.toString())
                }
                color={
                    query.activeTab === BusinessUnit.BENGKEL.toString()
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
                    query.activeTab ===
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
                    query.activeTab ===
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
                value={dayjs(query.year as string)}
                format="YYYY"
                onChange={onYearChange}
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
