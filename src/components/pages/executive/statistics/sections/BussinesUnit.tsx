import { memo } from 'react'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
// icons
import AgricultureIcon from '@mui/icons-material/Agriculture'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ForestIcon from '@mui/icons-material/Forest'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
// page components
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import AlatBeratSubsection from '@/components/pages/executive/statistics/sections/BussinesUnit/AlatBerat'
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'
import SaprodiSubsection from './BussinesUnit/Saprodi'

const BusinessUnitSection = memo(function BusinessUnitSection() {
    return (
        <FlexColumnBox>
            <Heading2
                id="unit-bisnis"
                startIcon={<WorkIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                Unit Bisnis
            </Heading2>

            <Heading3
                startIcon={<AgricultureIcon />}
                id="alat-berat"
                sx={SX_SCROLL_MARGIN_TOP}>
                Alat Berat
            </Heading3>

            <AlatBeratSubsection />

            <Heading3
                startIcon={<WarehouseIcon />}
                id="saprodi"
                sx={SX_SCROLL_MARGIN_TOP}>
                SAPRODI
            </Heading3>

            <SaprodiSubsection />

            <Heading3
                startIcon={<CurrencyExchangeIcon />}
                id="spp"
                sx={SX_SCROLL_MARGIN_TOP}>
                SPP
            </Heading3>

            <Heading3
                startIcon={<ForestIcon />}
                id="tbs"
                sx={SX_SCROLL_MARGIN_TOP}>
                TBS
            </Heading3>
        </FlexColumnBox>
    )
})

export default BusinessUnitSection
