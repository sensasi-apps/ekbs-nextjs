import type Product from '@/dataTypes/mart/Product'
import { memo } from 'react'
import {
    Box,
    Card,
    CardActionArea,
    CardActionAreaProps,
    CardContent,
    Fade,
    Typography,
    Zoom,
} from '@mui/material'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// components
import ChipSmall from '@/components/ChipSmall'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import { useFormikContext } from 'formik'
import { FormikStatusType } from '../../formik-wrapper'
import formatNumber from '@/utils/formatNumber'

const WAREHOUSE = 'main'

function ProductCard({
    data: {
        id,
        code,
        name,
        description,
        category_name,
        unit,
        warehouses,
        deleted_at,
        is_in_opname,
    },
    onClick,
}: {
    data: Product & {
        is_in_opname: boolean
    }
    onClick: CardActionAreaProps['onClick']
}) {
    const { status } = useFormikContext()
    const typedStatus = status as FormikStatusType

    const { default_sell_price, qty = 0 } =
        warehouses.find(warehouse => warehouse.warehouse === WAREHOUSE) ?? {}

    const isDisabled =
        !typedStatus?.isFormOpen ||
        !!deleted_at ||
        typedStatus.isDisabled ||
        qty <= 0 ||
        is_in_opname

    return (
        <Zoom in>
            <Card
                component="span"
                variant={isDisabled ? 'elevation' : 'outlined'}
                elevation={0}
                sx={{
                    borderRadius: 4,
                    textDecoration: deleted_at ? 'line-through' : 'none',
                }}>
                <CardActionArea onClick={onClick} disabled={isDisabled}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}>
                        {is_in_opname && (
                            <ChipSmall
                                component="div"
                                label="OPNAME"
                                variant="filled"
                                color="warning"
                            />
                        )}

                        {qty <= 0 && (
                            <ChipSmall
                                component="div"
                                label="HABIS"
                                variant="filled"
                                color="error"
                            />
                        )}

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            gap={1}>
                            <ChipSmall
                                label={category_name ?? 'Tanpa Kategori'}
                                variant="outlined"
                            />

                            <Fade in={!isDisabled}>
                                <AddCircleIcon color="success" />
                            </Fade>
                        </Box>

                        <Typography
                            component="div"
                            variant="caption"
                            color="text.disabled">
                            #{id}
                            {code ? ` / ${code}` : ''}
                        </Typography>

                        <Typography component="div">
                            {name}

                            <Typography
                                mt={-1}
                                color="text.disabled"
                                sx={{
                                    verticalAlign: 'middle',
                                }}
                                variant="caption"
                                component="span">
                                {' '}
                                {formatNumber(qty)}
                            </Typography>
                        </Typography>

                        <Typography
                            variant="h5"
                            component="div"
                            color="success.main">
                            {numberToCurrency(default_sell_price ?? 0)}
                        </Typography>

                        <Typography
                            mt={-1}
                            color="text.disabled"
                            variant="overline">
                            / {unit}
                        </Typography>

                        {description && (
                            <Typography variant="body2" color="text.disabled">
                                {description}
                            </Typography>
                        )}
                    </CardContent>
                </CardActionArea>
            </Card>
        </Zoom>
    )
}

export default memo(ProductCard)
