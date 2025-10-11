// vendors

// icons-materials
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// materials
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { memo } from 'react'
import IconButton from '@/components/IconButton'
import formatNumber from '@/utils/format-number'
//
import type { FormValuesType } from '../../../../components/pages/marts/products/sales/formik-wrapper'

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
                    color="error"
                    component="div"
                    disabled={disabled}
                    icon={RemoveCircleIcon}
                    onClick={ev => {
                        ev.stopPropagation()
                        onDecreaseQtyItem()
                    }}
                    size="small"
                    sx={{
                        p: 0,
                    }}
                    tabIndex={-1}
                    title="Kurangi jumlah"
                />
            </Grid>
            <Grid
                component={Typography}
                fontSize="1.1em"
                lineHeight="1.5rem"
                overflow="hidden"
                pl={1}
                size={7}
                textOverflow="ellipsis"
                variant="overline"
                whiteSpace="nowrap">
                {product?.name}
                <Typography component="div" variant="caption">
                    {formatNumber(Math.abs(qty))} {product?.unit} &times; RP{' '}
                    {formatNumber(rp_per_unit)}
                </Typography>
            </Grid>
            <Grid
                component={Typography}
                fontSize="1.1em"
                lineHeight="unset"
                size={{ xs: 1 }}
                textAlign="end"
                variant="overline">
                Rp
            </Grid>
            <Grid
                component={Typography}
                fontSize="1.1em"
                lineHeight="unset"
                size={3}
                textAlign="end"
                variant="overline">
                {formatNumber(qty * rp_per_unit)}
            </Grid>
        </>
    )
}

export default memo(DetailItem)
