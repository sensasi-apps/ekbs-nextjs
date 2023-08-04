import { useContext, useState } from 'react'
import PropTypes from 'prop-types'

import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Collapse,
    Grid,
    Typography,
} from '@mui/material'

import numberFormat from '@/lib/numberFormat'

import UserSimplifiedViewUserBox from '../User/SimplifiedView/ButtonAndDialogForm'
import { ContactList } from '../User/Socials/CrudBox'

import AppContext from '@/providers/App'
import Installment from '@/classes/Installment'
import moment from 'moment'
import InstallmentPaymentForm from './PaymentForm'

const InstallmentSummaryCard = ({ data: installment, mode, sx, ...props }) => {
    const {
        auth: { userHasPermission },
    } = useContext(AppContext)

    const [isCollapsed, setIsCollapsed] = useState(false)

    const today = moment().startOf('day')

    const getSx = forEl => {
        const fiveDaysLater = moment().startOf('day').add(5, 'days')

        let color = undefined

        if (installment.should_be_paid_at.isSameOrBefore(fiveDaysLater, 'day'))
            color = 'warning.main'
        if (installment.should_be_paid_at.isBefore(today, 'day'))
            color = 'error.main'

        const sx = {}

        if (forEl === 'card' && color) {
            sx.border = 2
            sx.borderColor = color
        }

        if (forEl === 'typography' && color) {
            sx.color = color
            sx.fontWeight = 2
        }

        return sx
    }

    return (
        <Card sx={{ ...getSx('card'), ...sx }} {...props}>
            <CardContent>
                <Typography sx={getSx('typography')} gutterBottom>
                    {installment.should_be_paid_at.format('DD MMMM YYYY')} (
                    {installment.should_be_paid_at.isSame(today)
                        ? 'hari ini'
                        : installment.should_be_paid_at.from(today)}
                    )
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                        <Typography color="GrayText">Angsuran ke-:</Typography>
                        <Typography mb={1}>{installment.n_th}</Typography>

                        <Typography color="GrayText">Tagihan:</Typography>
                        <Typography variant="h4" component="div">
                            {numberFormat(installment.amount_rp)}
                        </Typography>
                    </Grid>

                    {mode === 'manager' && (
                        <Grid item xs={12} md={6}>
                            <Typography color="GrayText">Peminjam:</Typography>
                            <Card elevation={2}>
                                <CardActionArea
                                    onClick={() =>
                                        setIsCollapsed(prev => !prev)
                                    }>
                                    <CardContent>
                                        <UserSimplifiedViewUserBox
                                            data={
                                                installment.installmentable.user
                                            }
                                        />

                                        <Collapse in={isCollapsed}>
                                            <Typography color="GrayText" mt={1}>
                                                Kontak:
                                            </Typography>
                                            <ContactList
                                                data={
                                                    installment.installmentable
                                                        .user?.socials
                                                }
                                                readMode
                                            />

                                            <Typography color="GrayText" mt={1}>
                                                Riwayat TBS:
                                            </Typography>
                                            <Typography>
                                                <i>Akan datang</i>
                                            </Typography>
                                        </Collapse>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </CardContent>

            {userHasPermission('collect user loan') && mode === 'manager' && (
                <Box>
                    <Typography px={2} color="GrayText">
                        Sudah dibayar:
                    </Typography>
                    <InstallmentPaymentForm data={installment} />
                </Box>
            )}
        </Card>
    )
}

InstallmentSummaryCard.propTypes = {
    data: PropTypes.instanceOf(Installment).isRequired,
    mode: PropTypes.oneOf(['applier', 'manager']).isRequired,
}

export default InstallmentSummaryCard
