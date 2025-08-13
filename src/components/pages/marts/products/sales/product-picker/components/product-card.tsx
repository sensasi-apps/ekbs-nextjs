// vendors
import { memo } from 'react'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea, {
    type CardActionAreaProps,
} from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// components
import type Product from '@/dataTypes/mart/Product'
import ChipSmall from '@/components/ChipSmall'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import { useFormikContext } from 'formik'
import type { FormikStatusType } from '../../formik-wrapper'
import formatNumber from '@/utils/format-number'

function ProductCard({
    qty,
    defaultSellPrice,
    data: {
        id,
        code,
        name,
        barcode_reg_id,
        description,
        category_name,
        unit,
        deleted_at,
        is_in_opname,
    },
    searchText,
    onClick,
}: {
    qty: number
    defaultSellPrice: number
    data: Product & {
        is_in_opname: boolean
    }
    searchText: string
    onClick: CardActionAreaProps['onClick']
}) {
    const { status } = useFormikContext()
    const typedStatus = status as FormikStatusType

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
                                label="KOSONG"
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
                            #{getHighlightedText(id.toString(), searchText)}
                            {code ? (
                                <>
                                    {' / '}
                                    {getHighlightedText(code, searchText)}
                                </>
                            ) : (
                                ''
                            )}
                            {barcode_reg_id ? (
                                <>
                                    {' / '}
                                    {getHighlightedText(
                                        barcode_reg_id,
                                        searchText,
                                    )}
                                </>
                            ) : (
                                ''
                            )}
                        </Typography>

                        <Typography component="div">
                            {getHighlightedText(name, searchText)}

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
                            {numberToCurrency(defaultSellPrice)}
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

function getHighlightedText(text: string, highlight: string) {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))

    return (
        <>
            {parts.map((part, i) => (
                <Box
                    component="span"
                    key={i}
                    color={
                        part.toLowerCase() === highlight.toLowerCase()
                            ? 'warning.main'
                            : undefined
                    }>
                    {part}
                </Box>
            ))}
        </>
    )
}
