// vendors
import { memo } from 'react'
// materials
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// icons-materials
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
//
import type { FormValuesType } from '../../../../components/pages/marts/products/sales/formik-wrapper'
import IconButton from '@/components/IconButton'
import formatNumber from '@/utils/format-number'

function DetailItem({
    data: { qty, rp_per_unit, product },
    disabled,
    onDecreaseQtyItem,
}: {
    disabled: boolean
    data: FormValuesType['details'][0]
    onDecreaseQtyItem: () => void
}) {
    return (
        <>
            <Grid size={{ xs: 1 }}>
                <IconButton
                    title="Kurangi jumlah"
                    size="small"
                    disabled={disabled}
                    icon={RemoveCircleIcon}
                    tabIndex={-1}
                    onClick={ev => {
                        ev.stopPropagation()
                        onDecreaseQtyItem()
                    }}
                    sx={{
                        p: 0,
                    }}
                    color="error"
                    component="div"
                />
            </Grid>
            <Grid
                component={Typography}
                variant="overline"
                lineHeight="1.5rem"
                fontSize="1.1em"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                pl={1}
                size={7}>
                {product?.name}
                <Typography variant="caption" component="div">
                    {formatNumber(Math.abs(qty))} {product?.unit} &times; RP{' '}
                    {formatNumber(rp_per_unit)}
                </Typography>
            </Grid>
            <Grid
                size={{ xs: 1 }}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1.1em">
                Rp
            </Grid>
            <Grid
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1.1em"
                size={3}>
                {formatNumber(qty * rp_per_unit)}
            </Grid>
        </>
    )
}

export default memo(DetailItem)
