// types
import type { FormEvent } from 'react'
import type { PalmBunchesReaTicket } from '@/dataTypes/PalmBunchReaTicket'
import type FormType from '@/components/Global/Form/type'
import type ActivityLogType from '@/types/orms/activity-log'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/GridLegacy'
// icons
import InfoIcon from '@mui/icons-material/Info'
// local components
import GradingItemInputs from './Form/GradingItemInputs'
import PalmBunchApiUrlEnum from '@/components/pages/palm-bunch/ApiUrlEnum'
import PalmBunchesReaDeliveryMainInputs from './Form/MainInputs'
import PalmBunchesReaDeliveryFarmerInputs from './Form/FarmerInputs'
import UserActivityLogsDialogTable from '../UserActivityLogs/DialogTable'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useValidationErrors from '@/hooks/useValidationErrors'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
// enums
import Role from '@/enums/Role'
import ReaTiketPaymentDetailView from './Form/ReaTiketPaymentDetailView'
import PalmBunch from '@/enums/permissions/PalmBunch'

export default function PalmBunchesReaTicketForm({
    data,
    actionsSlot,
    loading,
    setSubmitting,
    onSubmitted,
}: FormType<PalmBunchesReaTicket>) {
    const isAuthHasPermission = useIsAuthHasPermission()
    const isAuthHasRole = useIsAuthHasRole()

    const disabled =
        Boolean(loading || (data?.delivery?.transactions?.length || 0) > 0) ||
        !isAuthHasRole([Role.PALM_BUNCH_MANAGER, Role.PALM_BUNCH_ADMIN])

    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget

        if (!formEl.reportValidity()) return

        setSubmitting(true)

        const formData = new FormData(formEl)
        const atDmy = formData.get('at')
        const atDayJs = dayjs(atDmy as string, 'DD-MM-YYYY')
        formData.set('at', atDayJs.format('YYYY-MM-DD'))

        axios
            .post(
                PalmBunchApiUrlEnum.UPDATE_OR_CREATE_TICKET.replace(
                    '$1',
                    data?.id ? `/${data?.id}` : '',
                ),
                formData,
            )
            .then(() => {
                onSubmitted()
            })
            .catch(error => {
                if (error?.response?.status === 422) {
                    return setValidationErrors(error?.response.data.errors)
                }
            })
            .finally(() => setSubmitting(false))
    }

    return (
        <form
            id="palm-bunches-rea-deliveries-form"
            autoComplete="off"
            onSubmit={handleSubmit}>
            <Grid container columnSpacing={2} rowSpacing={4}>
                <Grid item xs={12} sm={7}>
                    <PalmBunchesReaDeliveryMainInputs
                        validationErrors={validationErrors}
                        clearByName={clearByName}
                        disabled={disabled}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <GradingItemInputs
                        disabled={disabled}
                        clearByName={clearByName}
                        validationErrors={validationErrors}
                    />
                </Grid>
            </Grid>

            <PalmBunchesReaDeliveryFarmerInputs
                disabled={disabled}
                validationErrors={validationErrors}
                clearByName={clearByName}
            />

            {isAuthHasRole(Role.PALM_BUNCH_MANAGER) && (
                <>
                    <ReaTiketPaymentDetailView data={data} />

                    <FormControlLabel
                        sx={{ mt: 2 }}
                        name="validate_now"
                        disabled={disabled}
                        control={
                            <Checkbox
                                value="true"
                                defaultChecked={Boolean(data.validated_at)}
                            />
                        }
                        label="Data yang di-input sudah sesuai dengan yang diinginkan"
                    />
                </>
            )}

            {data.validated_by_user && (
                <Box component={FormHelperText} mb={2}>
                    Telah divalidasi oleh {data?.validated_by_user.name} pada{' '}
                    {dayjs(data.validated_at).format('DD-MM-YYYY HH:mm')}
                </Box>
            )}

            {!data?.delivery?.transactions?.length &&
                isAuthHasPermission([
                    PalmBunch.CREATE_TICKET,
                    PalmBunch.UPDATE_TICKET,
                ]) &&
                actionsSlot}

            {/* TODO: refactor to permission based */}
            {isAuthHasRole(Role.PALM_BUNCH_MANAGER) &&
                data.id &&
                data.delivery && (
                    <UserActivityLog
                        data={[
                            ...data.delivery.logs,
                            ...data.delivery.palm_bunches.flatMap(
                                palmBunch => palmBunch.logs ?? [],
                            ),
                        ]}
                    />
                )}
        </form>
    )
}

const UserActivityLog = ({ data }: { data: ActivityLogType[] }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} startIcon={<InfoIcon />}>
                Riwayat Data
            </Button>
            <UserActivityLogsDialogTable
                open={open}
                setIsOpen={setOpen}
                data={data}
            />
        </>
    )
}
