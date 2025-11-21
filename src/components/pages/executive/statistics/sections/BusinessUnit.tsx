// icons
import AgricultureIcon from '@mui/icons-material/Agriculture'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ForestIcon from '@mui/icons-material/Forest'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
// components
import FlexColumnBox from '@/components/flex-column-box'
// page components
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import AlatBeratSubsection from '@/components/pages/executive/statistics/sections/BusinessUnit/AlatBerat'
// constants
import SX_SCROLL_MARGIN_TOP from '../SX_SCROLL_MARGIN_TOP'
import SaprodiSubsection from './BusinessUnit/Saprodi'
import SppSubsection from './BusinessUnit/Spp'
import TbsSubsection from './BusinessUnit/Tbs'

export default function BusinessUnitSection() {
    return (
        <FlexColumnBox>
            <Heading2
                id="unit-bisnis"
                startIcon={<WorkIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                Unit Bisnis
            </Heading2>

            <Heading3
                id="alat-berat"
                startIcon={<AgricultureIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                Alat Berat
            </Heading3>

            <AlatBeratSubsection />

            <Heading3
                id="saprodi"
                startIcon={<WarehouseIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                SAPRODI
            </Heading3>

            <SaprodiSubsection />

            <Heading3
                id="spp"
                startIcon={<CurrencyExchangeIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                SPP
            </Heading3>

            <SppSubsection />

            <Heading3
                id="tbs"
                startIcon={<ForestIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                TBS
            </Heading3>

            <TbsSubsection />
        </FlexColumnBox>
    )
}
