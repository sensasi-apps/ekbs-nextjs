import { memo } from 'react'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
// icons
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ForestIcon from '@mui/icons-material/Forest'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
// page components
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import AlatBeratSubsection from '@/components/pages/executive/statistics/sections/BussinesUnit/AlatBerat'

const BusinessUnitSection = memo(function BusinessUnitSection() {
    return (
        <FlexColumnBox>
            <Heading2
                id="unit-bisnis"
                startIcon={<WorkIcon />}
                sx={{
                    scrollMarginTop: '6rem',
                }}>
                Unit Bisnis
            </Heading2>

            <AlatBeratSubsection />

            <Heading3
                startIcon={<WarehouseIcon />}
                id="saprodi"
                sx={{
                    scrollMarginTop: '6rem',
                }}>
                SAPRODI
            </Heading3>

            <Heading3
                startIcon={<CurrencyExchangeIcon />}
                id="spp"
                sx={{
                    scrollMarginTop: '6rem',
                }}>
                SPP
            </Heading3>

            <Heading3
                startIcon={<ForestIcon />}
                id="tbs"
                sx={{
                    scrollMarginTop: '6rem',
                }}>
                TBS
            </Heading3>
        </FlexColumnBox>
    )
})

export default BusinessUnitSection
