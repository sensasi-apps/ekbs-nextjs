import type { FormValuesType } from '../formik-wrapper'
import { memo } from 'react'
import { Typography } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@/components/IconButton'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import formatNumber from '@/utils/formatNumber'

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
            <Grid2 size={{ xs: 1 }}>
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
            </Grid2>
            <Grid2
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
            </Grid2>
            <Grid2
                size={{ xs: 1 }}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1.1em">
                Rp
            </Grid2>
            <Grid2
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1.1em"
                size={3}>
                {formatNumber(qty * rp_per_unit)}
            </Grid2>
        </>
    )
}

export default memo(DetailItem)
